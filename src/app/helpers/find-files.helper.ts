/**
 * @fileoverview Core file discovery engine for the extension's sidebar tree views.
 *
 * Provides glob-based file searching with two strategies:
 * - **Local** (default): uses FastGlob streaming for direct filesystem access.
 * - **Remote**: falls back to VSCode's `workspace.findFiles` API for virtual
 *   or remote workspaces where the filesystem isn't directly accessible.
 *
 * Includes a shared in-memory cache with TTL-based eviction and deduplication
 * of concurrent in-flight requests to avoid redundant filesystem scans.
 */

import FastGlob from 'fast-glob';
import ignore, { type Ignore } from 'ignore';
import { posix } from 'path';
import {
  RelativePattern,
  Uri,
  type WorkspaceFolder,
  window,
  workspace,
} from 'vscode';

// Shared cache for all file operations across the extension
const findFilesCache: Map<string, { files: Uri[]; timestamp: number }> =
  new Map();
const findFilesCacheTTL = 5 * 60 * 1000; // 5 minutes
const findFilesInFlight: Map<string, Promise<Uri[]>> = new Map();

const MAX_FILES_TO_INDEX_LIMIT = 5000;
const MAX_CACHE_SIZE = 100;

/**
 * Options for configuring file discovery behavior.
 */
export interface FindFilesOptions {
  /** Absolute path to the directory to search within. */
  baseDirectoryPath: string;
  /** Glob patterns for files to include (e.g. `["**\/*.controller.ts"]`). */
  includeFilePatterns: string[];
  /** Glob patterns for files/directories to exclude. */
  excludedPatterns?: string[];
  /** When `true`, only match files directly inside `baseDirectoryPath` (no subdirectories). */
  disableRecursive?: boolean;
  /** Maximum folder depth to recurse into (0 = unlimited). */
  maxRecursionDepth?: number;
  /** When `true`, include files and directories starting with a dot. */
  includeDotfiles?: boolean;
  /** When `true`, read the workspace `.gitignore` and apply its rules as exclude filters. */
  enableGitignoreDetection?: boolean;
}

/** Normalizes a file path to POSIX separators for cross-platform glob matching. */
const toPosix = (filePath: string) => filePath.replace(/\\/g, '/');

/**
 * Builds an ignore matcher that combines explicit exclude patterns with
 * optional `.gitignore` rules from the workspace root. The resulting matcher
 * is used to filter out unwanted files after glob discovery.
 */
const getIgnoreMatcher = async (options: {
  baseDirectoryPath: string;
  excludedPatterns: string[];
  enableGitignoreDetection: boolean;
}): Promise<Ignore> => {
  const { baseDirectoryPath, excludedPatterns, enableGitignoreDetection } =
    options;
  const ignoreMatcher = ignore();

  if (excludedPatterns.length) {
    ignoreMatcher.add(excludedPatterns.map(toPosix));
  }

  if (enableGitignoreDetection) {
    try {
      const gitignoreUri = Uri.joinPath(
        Uri.file(baseDirectoryPath),
        '.gitignore',
      );
      await workspace.fs.stat(gitignoreUri);
      const data = await workspace.fs.readFile(gitignoreUri);
      const content = new TextDecoder('utf-8').decode(data);
      ignoreMatcher.add(content);
    } catch {
      // no .gitignore or not accessible - ignore
    }
  }

  return ignoreMatcher;
};

/**
 * File discovery strategy for remote/virtual workspaces (e.g. SSH, WSL, Codespaces)
 * where FastGlob cannot access the filesystem directly. Delegates to VSCode's
 * built-in `workspace.findFiles` API and applies post-filters for depth,
 * dotfiles, and ignore rules.
 */
const findFilesRemote = async (
  options: FindFilesOptions,
  workspaceFolder: WorkspaceFolder,
  ignoreMatcher?: Ignore,
): Promise<Uri[]> => {
  const { includeFilePatterns, excludedPatterns = [] } = options;
  const seen = new Set<string>();
  const aggregated: Uri[] = [];
  const posixExcluded = excludedPatterns.map(toPosix);
  const combinedExclude =
    posixExcluded.length > 0 ? `{${posixExcluded.join(',')}}` : undefined;
  let total = 0;

  for (const includePatternGlob of includeFilePatterns) {
    if (total >= MAX_FILES_TO_INDEX_LIMIT) {
      break;
    }

    const relativePattern = new RelativePattern(
      workspaceFolder,
      includePatternGlob,
    );
    const found = await workspace.findFiles(
      relativePattern,
      combinedExclude,
      MAX_FILES_TO_INDEX_LIMIT - total,
    );
    for (const fileUri of found) {
      if (seen.has(fileUri.fsPath)) {
        continue;
      }
      seen.add(fileUri.fsPath);
      aggregated.push(fileUri);
      total++;
      if (total >= MAX_FILES_TO_INDEX_LIMIT) {
        break;
      }
    }
  }

  const basePosix = toPosix(options.baseDirectoryPath).replace(/\/$/, '');

  const filterByDepth = (candidateUri: Uri) => {
    if (options.disableRecursive) {
      const rel = toPosix(candidateUri.fsPath).slice(basePosix.length + 1);
      return !rel.includes('/');
    }
    if (!options.maxRecursionDepth || options.maxRecursionDepth <= 0) {
      return true;
    }
    const relativeFilePath = toPosix(candidateUri.fsPath).slice(
      basePosix.length + 1,
    );
    const segments = relativeFilePath.split('/');
    const folderDepth = Math.max(0, segments.length - 1);
    return folderDepth <= options.maxRecursionDepth;
  };

  const filterDotfiles = (candidateUri: Uri) => {
    if (options.includeDotfiles) {
      return true;
    }
    const relative = workspace.asRelativePath(candidateUri, false);
    return !relative.split(/[\\\/]/).some((s) => s.startsWith('.'));
  };

  const filterIgnored = (candidateUri: Uri) => {
    if (!ignoreMatcher) {
      return true;
    }
    const filePosix = toPosix(candidateUri.fsPath);
    const relativeFilePath = posix.relative(basePosix, filePosix);
    return !ignoreMatcher.ignores(relativeFilePath);
  };

  return aggregated
    .filter(filterByDepth)
    .filter(filterDotfiles)
    .filter(filterIgnored)
    .sort((a, b) => a.fsPath.localeCompare(b.fsPath))
    .slice(0, MAX_FILES_TO_INDEX_LIMIT);
};

/**
 * Default file discovery strategy for local workspaces. Uses FastGlob streaming
 * to incrementally match files without loading the entire result set into memory.
 * Applies depth, dotfile, and ignore filters inline during streaming.
 */
const findFilesLocal = async (
  options: FindFilesOptions,
  ignoreMatcher?: Ignore,
): Promise<Uri[]> => {
  const {
    baseDirectoryPath,
    includeFilePatterns,
    excludedPatterns = [],
  } = options;
  const includeGlobs = includeFilePatterns.map(toPosix);

  const aggregatedUris: Uri[] = [];
  const seenPaths = new Set<string>();
  let totalCollected = 0;

  const stream = FastGlob.stream(includeGlobs, {
    cwd: baseDirectoryPath,
    dot: options.includeDotfiles,
    ignore: excludedPatterns.map(toPosix),
    onlyFiles: true,
    unique: true,
    followSymbolicLinks: true,
    absolute: true,
  });

  try {
    for await (const matchedPath of stream as AsyncIterable<string>) {
      if (!matchedPath) {
        continue;
      }
      const absolutePosixPath = toPosix(matchedPath);
      if (seenPaths.has(absolutePosixPath)) {
        continue;
      }

      const candidateUri = Uri.file(matchedPath);

      const basePosix = toPosix(baseDirectoryPath).replace(/\/$/, '');
      const relPath = absolutePosixPath.startsWith(`${basePosix}/`)
        ? absolutePosixPath.slice(basePosix.length + 1)
        : absolutePosixPath;

      if (options.disableRecursive && relPath.includes('/')) {
        continue;
      }
      if (
        !options.disableRecursive &&
        options.maxRecursionDepth &&
        options.maxRecursionDepth > 0
      ) {
        const segments = relPath.split('/');
        const folderDepth = Math.max(0, segments.length - 1);
        if (folderDepth > options.maxRecursionDepth) {
          continue;
        }
      }

      if (!options.includeDotfiles) {
        const relativeForDot = workspace.asRelativePath(candidateUri, false);
        if (relativeForDot.split(/[\\\/]/).some((seg) => seg.startsWith('.'))) {
          continue;
        }
      }

      if (ignoreMatcher) {
        const relativePathForIgnore = posix.relative(
          basePosix,
          absolutePosixPath,
        );
        if (ignoreMatcher.ignores(relativePathForIgnore)) {
          continue;
        }
      }

      seenPaths.add(absolutePosixPath);
      aggregatedUris.push(candidateUri);
      totalCollected++;

      if (totalCollected >= MAX_FILES_TO_INDEX_LIMIT) {
        if (typeof (stream as any).destroy === 'function') {
          try {
            (stream as any).destroy();
          } catch {
            // ignore
          }
        }
        break;
      }
    }
  } catch (streamErr) {
    try {
      if (typeof (stream as any).destroy === 'function') {
        (stream as any).destroy();
      }
    } catch {
      // ignore
    }
    throw streamErr;
  }

  return aggregatedUris
    .sort((a, b) => a.fsPath.localeCompare(b.fsPath))
    .slice(0, MAX_FILES_TO_INDEX_LIMIT);
};

/**
 * Stores search results in the shared cache. Performs TTL-based eviction of
 * expired entries and LRU-style eviction of the oldest entries when the cache
 * exceeds `MAX_CACHE_SIZE`.
 */
const updateCache = (cacheKey: string, files: Uri[]) => {
  const now = Date.now();
  // Evict old entries
  for (const [key, cachedEntry] of findFilesCache.entries()) {
    if (now - cachedEntry.timestamp >= findFilesCacheTTL) {
      findFilesCache.delete(key);
    }
  }
  // Evict oldest if cache is full
  if (findFilesCache.size >= MAX_CACHE_SIZE) {
    const entriesByAge = Array.from(findFilesCache.entries()).sort(
      (a, b) => a[1].timestamp - b[1].timestamp,
    );
    const excess = findFilesCache.size - MAX_CACHE_SIZE + 1;
    for (let i = 0; i < excess; i++) {
      findFilesCache.delete(entriesByAge[i][0]);
    }
  }
  findFilesCache.set(cacheKey, { files, timestamp: now });
};

/**
 * Clears the shared cache for file operations.
 * Useful when files have been created, deleted, or modified.
 *
 * @function clearCache
 * @public
 * @example
 * clearCache();
 *
 * @returns {void} - No return value
 */
export const clearCache = (): void => {
  findFilesCache.clear();
  findFilesInFlight.clear();
};

/**
 * Searches for files in a directory that match specified patterns, with optimized performance.
 * Uses fast-glob for discovery and applies post-filters for recursion depth, dotfiles, and optional .gitignore rules.
 * Includes shared caching and optimizations for large projects with many files.
 *
 * @param {FindFilesOptions} options - The options for the file search.
 * @returns {Promise<Uri[]>} Array of VS Code Uri objects for the found files.
 * @throws {Error} If an error occurs during file search, it is caught and a message is displayed.
 */
export const findFiles = async (options: FindFilesOptions): Promise<Uri[]> => {
  const {
    baseDirectoryPath,
    includeFilePatterns,
    excludedPatterns = [],
    disableRecursive = false,
    maxRecursionDepth = 0,
    includeDotfiles = false,
    enableGitignoreDetection = false,
  } = options;
  try {
    if (!includeFilePatterns.length) {
      return [];
    }

    const cacheKey = JSON.stringify({
      baseDir: baseDirectoryPath,
      include: [...includeFilePatterns].map(toPosix).sort(),
      exclude: [...excludedPatterns].map(toPosix).sort(),
      disableRecursive,
      maxRecursionDepth,
      includeDotfiles,
      enableGitignoreDetection,
    });

    const ongoing = findFilesInFlight.get(cacheKey);
    if (ongoing) {
      return ongoing;
    }

    const work = (async (): Promise<Uri[]> => {
      const cached = findFilesCache.get(cacheKey);
      if (cached && Date.now() - cached.timestamp < findFilesCacheTTL) {
        return cached.files;
      }

      const ignoreMatcher = await getIgnoreMatcher({
        baseDirectoryPath,
        excludedPatterns,
        enableGitignoreDetection,
      });

      const baseUri = Uri.file(baseDirectoryPath);
      const workspaceFolder = workspace.getWorkspaceFolder(baseUri);
      const isRemoteWorkspace =
        !!workspaceFolder?.uri.scheme && workspaceFolder.uri.scheme !== 'file';

      let results: Uri[];
      if (isRemoteWorkspace) {
        results = await findFilesRemote(
          options,
          workspaceFolder,
          ignoreMatcher,
        );
      } else {
        results = await findFilesLocal(options, ignoreMatcher);
      }

      updateCache(cacheKey, results);
      return results;
    })();

    findFilesInFlight.set(cacheKey, work);
    try {
      return await work;
    } finally {
      findFilesInFlight.delete(cacheKey);
    }
  } catch (error) {
    const errorInstance =
      error instanceof Error ? error : new Error(String(error));
    console.error('findFiles error', errorInstance);
    try {
      const errorMessage = errorInstance?.message ?? String(errorInstance);
      window.showErrorMessage(errorMessage);
    } catch {
      // ignore UI errors
    }
    return [];
  }
};
