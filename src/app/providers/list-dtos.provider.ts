/**
 * @file Tree data provider that discovers *.dto.ts files containing
 * class-validator decorators and lists their annotation lines as navigable
 * child nodes in the sidebar.
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
  workspace,
} from 'vscode';

import { CommandIds, EXTENSION_ID } from '../configs';
import { DTOController, ListFilesController } from '../controllers';
import { NodeModel } from '../models';

/**
 * Discovers *.dto.ts files containing class-validator decorators and shows
 * matching annotation lines as child nodes. Uses {@link DTOController} to
 * obtain the regex that identifies DTO annotations.
 *
 * @class
 * @implements {TreeDataProvider<NodeModel>}
 * @see https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider
 */
export class ListDTOsProvider implements TreeDataProvider<NodeModel> {
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
   * Constructor for the ListDTOsProvider class.
   *
   * @constructor
   * @param controller - DTO controller providing annotation regex.
   */
  constructor(readonly controller: DTOController) {
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
   * Returns the children for the supplied element, or the top-level DTO
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

    this._cachePromise = this.getListDtos().then((nodes) => {
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

  // Private methods
  /**
   * Filters workspace files for *.dto.ts, then scans each for class-validator
   * annotations using the regex from {@link DTOController.getAnnotationsRegex}.
   * Files with matches are returned with annotation lines as clickable children.
   *
   * @returns DTO file nodes with their annotation lines as children.
   */
  private async getListDtos(): Promise<NodeModel[] | undefined> {
    const files = await ListFilesController.getFiles();

    if (!files) {
      return;
    }

    // List of DTOs
    const nodes = files.filter((file) =>
      file.label.toString().includes('dto.ts'),
    );

    const importRegex = this.controller.getAnnotationsRegex();

    if (!importRegex) {
      return;
    }

    const { results, errors } = await PromisePool.for(nodes)
      .withConcurrency(2)
      .process(async (file) => {
        const uri = file.resourceUri;

        if (!uri) {
          return file;
        }

        const document = await workspace.openTextDocument(uri);

        const children = Array.from(
          { length: document.lineCount },
          (_, index) => {
            const line = document.lineAt(index);

            let node: NodeModel | undefined;

            if (importRegex.test(line.text)) {
              node = new NodeModel(
                line.text.trim(),
                new ThemeIcon('symbol-method'),
                {
                  command: `${EXTENSION_ID}.${CommandIds.ListGotoLine}`,
                  title: line.text,
                  arguments: [uri, index],
                },
              );
              node.description = l10n.t('line {0}', index + 1);
              node.tooltip = l10n.t('{0}:{1}', document.uri.fsPath, index + 1);
            }

            return node;
          },
        );

        file.setChildren(
          children.filter((child) => child !== undefined) as NodeModel[],
        );

        return file;
      });

    if (errors.length > 0) {
      console.error('Errors processing DTO files:', errors);
    }

    return results.filter(
      (file) => file.children && file.children.length !== 0,
    );
  }
}
