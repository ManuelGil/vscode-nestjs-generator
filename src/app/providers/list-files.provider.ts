/**
 * @file Tree data provider that groups workspace files by configured watch
 * categories (e.g., controllers, services, dtos) for the sidebar file browser.
 */
import { PromisePool } from '@supercharge/promise-pool';
import {
  Event,
  EventEmitter,
  l10n,
  ProviderResult,
  ThemeIcon,
  TreeDataProvider,
  TreeItem,
} from 'vscode';

import { ListFilesController } from '../controllers';
import { NodeModel } from '../models';

/**
 * Groups workspace files by configured watch categories (e.g., controllers,
 * services, dtos) and serves as the top-level file browser in the sidebar.
 * Delegates file discovery to {@link ListFilesController} and uses PromisePool
 * for concurrent processing of each category.
 *
 * @class
 * @implements {TreeDataProvider<NodeModel>}
 * @see https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider
 */
export class ListFilesProvider implements TreeDataProvider<NodeModel> {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  // Public properties
  /**
   * Event fired when the tree data changes, consumed by VSCode to refresh the view.
   * @see https://code.visualstudio.com/api/references/vscode-api#Event
   */
  readonly onDidChangeTreeData: Event<NodeModel | undefined | null | void>;

  // Private properties
  /**
   * Backing emitter for {@link onDidChangeTreeData}.
   * @see https://code.visualstudio.com/api/references/vscode-api#EventEmitter
   */
  private _onDidChangeTreeData: EventEmitter<
    NodeModel | undefined | null | void
  >;

  /** Indicates whether the provider has been disposed. */
  private _isDisposed = false;

  /** Cached top-level nodes returned by the last successful fetch. */
  private _cachedNodes: NodeModel[] | undefined = undefined;

  /** In-flight fetch promise used to deduplicate concurrent getChildren calls. */
  private _cachePromise: Promise<NodeModel[] | undefined> | undefined =
    undefined;

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the ListFilesProvider class.
   * @constructor
   */
  constructor() {
    this._onDidChangeTreeData = new EventEmitter<
      NodeModel | undefined | null | void
    >();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;
  }

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods
  /**
   * Returns the tree item for the supplied element.
   *
   * @param element - The node to convert to a TreeItem.
   * @returns The tree item representation.
   * @see https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider
   */
  getTreeItem(element: NodeModel): TreeItem | Thenable<TreeItem> {
    return element as TreeItem;
  }

  /**
   * Returns the children for the supplied element, or the top-level category
   * nodes when no element is provided. Uses a cache to avoid redundant fetches.
   *
   * @param element - Parent node, or undefined for root.
   * @returns The child nodes.
   * @see https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider
   */
  getChildren(element?: NodeModel): ProviderResult<NodeModel[]> {
    if (element) {
      return element.children;
    }

    if (this._cachedNodes) {
      return this._cachedNodes;
    }

    if (this._cachePromise) {
      return this._cachePromise;
    }

    this._cachePromise = this.getListFiles().then((nodes) => {
      this._cachedNodes = nodes;
      this._cachePromise = undefined;
      return nodes;
    });

    return this._cachePromise;
  }

  /** Invalidates the cache and signals VSCode to re-fetch tree data. */
  refresh(): void {
    this._cachedNodes = undefined;
    this._cachePromise = undefined;
    this._onDidChangeTreeData.fire();
  }

  /** Releases resources held by this provider. */
  dispose(): void {
    this._onDidChangeTreeData.dispose();
    if (this._isDisposed) {
      return;
    }

    this._isDisposed = true;

    if (this._onDidChangeTreeData) {
      this._onDidChangeTreeData.dispose();
    }
  }

  /**
   * Fetches workspace files via {@link ListFilesController.getFiles} and groups
   * them into category nodes based on the configured watch tokens.
   *
   * @returns Category nodes, each containing matching file nodes as children.
   */
  private async getListFiles(): Promise<NodeModel[] | undefined> {
    const files = await ListFilesController.getFiles();

    if (!files) {
      return [];
    }

    // Build matchers from watch config. Accept tokens like
    //  - "controller" or "controllers" -> match ".controller.ts"
    //  - explicit tokens with dot, e.g. "module.ts" -> match literally
    const watchMatchers = (ListFilesController.config.watch || [])
      .map((token) => (token ?? '').trim())
      .filter((token): token is string => token.length > 0)
      .map((token) => {
        const hasDot = token.includes('.');
        const base = hasDot ? token : token.replace(/s$/, '');
        const escaped = base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        const regex = new RegExp(`\\.${escaped}(?:\\.|$)`);
        return { token, regex };
      });

    const { results, errors } = await PromisePool.for(watchMatchers)
      .withConcurrency(2)
      .process(async ({ token, regex }) => {
        const children = files.filter((file) =>
          regex.test(file.label.toString()),
        );

        if (children.length === 0) {
          return undefined;
        }
        // Stable sort children by label for predictable ordering
        children.sort((a, b) =>
          a.label.toString().localeCompare(b.label.toString()),
        );

        const node = new NodeModel(
          l10n.t('{0}: {1}', token, children.length),
          new ThemeIcon('folder-opened'),
          undefined,
          undefined,
          token,
          children,
        );
        node.tooltip = l10n.t(
          'Files matching "{0}" • {1}',
          token,
          children.length,
        );
        return node;
      });

    if (errors.length > 0) {
      console.error('Errors processing file types:', errors);
    }

    const nodes = results.filter(
      (node): node is NodeModel => node !== undefined,
    );

    // Sort groups by token (stored in contextValue) for consistent order
    nodes.sort((a, b) =>
      (a.contextValue ?? '').localeCompare(b.contextValue ?? ''),
    );

    return nodes;
  }
}
