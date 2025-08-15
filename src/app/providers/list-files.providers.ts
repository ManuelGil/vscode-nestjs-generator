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
 * The ListFilesProvider class
 *
 * @class
 * @classdesc The class that represents the list of files provider.
 * @export
 * @public
 * @implements {TreeDataProvider<NodeModel>}
 * @property {EventEmitter<NodeModel | undefined | null | void>} _onDidChangeTreeData - The onDidChangeTreeData event emitter
 * @property {Event<NodeModel | undefined | null | void>} onDidChangeTreeData - The onDidChangeTreeData event
 * @property {ListFilesController} controller - The list of files controller
 * @example
 * const provider = new ListFilesProvider();
 *
 * @see https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider
 */
export class ListFilesProvider implements TreeDataProvider<NodeModel> {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  // Public properties
  /**
   * The onDidChangeTreeData event.
   * @type {Event<NodeModel | undefined | null | void>}
   * @public
   * @memberof ListFilesProvider
   * @example
   * readonly onDidChangeTreeData: Event<Node | undefined | null | void>;
   * this.onDidChangeTreeData = this._onDidChangeTreeData.event;
   *
   * @see https://code.visualstudio.com/api/references/vscode-api#Event
   */
  readonly onDidChangeTreeData: Event<NodeModel | undefined | null | void>;

  // Private properties
  /**
   * The onDidChangeTreeData event emitter.
   * @type {EventEmitter<NodeModel | undefined | null | void>}
   * @private
   * @memberof ListFilesProvider
   * @example
   * this._onDidChangeTreeData = new EventEmitter<Node | undefined | null | void>();
   * this.onDidChangeTreeData = this._onDidChangeTreeData.event;
   *
   * @see https://code.visualstudio.com/api/references/vscode-api#EventEmitter
   */
  private _onDidChangeTreeData: EventEmitter<
    NodeModel | undefined | null | void
  >;

  /**
   * Indicates whether the provider has been disposed.
   * @type {boolean}
   * @private
   * @memberof ListFilesProvider
   * @example
   * this._isDisposed = false;
   */
  private _isDisposed = false;

  /**
   * The cached nodes.
   * @type {NodeModel[] | undefined}
   * @private
   * @memberof ListFilesProvider
   * @example
   * this._cachedNodes = undefined;
   */
  private _cachedNodes: NodeModel[] | undefined = undefined;

  /**
   * The cache promise.
   * @type {Promise<NodeModel[] | undefined> | undefined}
   * @private
   * @memberof ListFilesProvider
   * @example
   * this._cachePromise = undefined;
   */
  private _cachePromise: Promise<NodeModel[] | undefined> | undefined =
    undefined;

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the ListFilesProvider class
   *
   * @constructor
   * @public
   * @memberof ListFilesProvider
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
   * @function getTreeItem
   * @param {NodeModel} element - The element
   * @public
   * @memberof ListFilesProvider
   * @example
   * const treeItem = provider.getTreeItem(element);
   *
   * @returns {TreeItem | Thenable<TreeItem>} - The tree item
   *
   * @see https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider
   */
  getTreeItem(element: NodeModel): TreeItem | Thenable<TreeItem> {
    return element as TreeItem;
  }

  /**
   * Returns the children for the supplied element.
   *
   * @function getChildren
   * @param {NodeModel} [element] - The element
   * @public
   * @memberof ListFilesProvider
   * @example
   * const children = provider.getChildren(element);
   *
   * @returns {ProviderResult<NodeModel[]>} - The children
   *
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

  /**
   * Refreshes the tree data by firing the event.
   *
   * @function refresh
   * @public
   * @memberof ListFilesProvider
   * @example
   * provider.refresh();
   *
   * @returns {void} - No return value
   */
  refresh(): void {
    this._cachedNodes = undefined;
    this._cachePromise = undefined;
    this._onDidChangeTreeData.fire();
  }

  /**
   * Disposes the provider.
   *
   * @function dispose
   * @public
   * @memberof ListFilesProvider
   * @example
   * provider.dispose();
   *
   * @returns {void} - No return value
   */
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
   * Gets the list of files.
   *
   * @function getListFiles
   * @private
   * @memberof ListFilesProvider
   * @example
   * const files = provider.getListFiles();
   *
   * @returns {Promise<NodeModel[] | undefined>} - The list of files
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
