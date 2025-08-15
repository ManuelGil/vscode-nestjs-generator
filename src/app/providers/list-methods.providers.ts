import { PromisePool } from '@supercharge/promise-pool';
import {
  Event,
  EventEmitter,
  ProviderResult,
  ThemeIcon,
  TreeDataProvider,
  TreeItem,
  workspace,
} from 'vscode';

import { EXTENSION_ID } from '../configs';
import { ListFilesController } from '../controllers';
import { NodeModel } from '../models';

/**
 * The ListMethodsProvider class
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
 * const provider = new ListMethodsProvider();
 *
 * @see https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider
 */
export class ListMethodsProvider implements TreeDataProvider<NodeModel> {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  // Public properties
  /**
   * The onDidChangeTreeData event.
   * @type {Event<NodeModel | undefined | null | void>}
   * @public
   * @memberof ListMethodsProvider
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
   * @memberof ListMethodsProvider
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
   * @memberof ListMethodsProvider
   * @example
   * this._isDisposed = false;
   */
  private _isDisposed = false;

  /**
   * The cached nodes.
   * @type {NodeModel[] | undefined}
   * @private
   * @memberof ListMethodsProvider
   * @example
   * this._cachedNodes = undefined;
   */
  private _cachedNodes: NodeModel[] | undefined = undefined;

  /**
   * The cache promise.
   * @type {Promise<NodeModel[] | undefined> | undefined}
   * @private
   * @memberof ListMethodsProvider
   * @example
   * this._cachePromise = undefined;
   */
  private _cachePromise: Promise<NodeModel[] | undefined> | undefined =
    undefined;

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the ListMethodsProvider class
   *
   * @constructor
   * @public
   * @memberof ListMethodsProvider
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
   * @memberof ListMethodsProvider
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
   * @memberof ListMethodsProvider
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

    this._cachePromise = this.getListMethods().then((nodes) => {
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
   * @memberof ListMethodsProvider
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
   * @memberof ListMethodsProvider
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

  // Private methods
  /**
   * Returns the list of files.
   *
   * @function getListMethods
   * @private
   * @memberof ListMethodsProvider
   * @example
   * const files = provider.getListMethods();
   *
   * @returns {Promise<NodeModel[] | undefined>} - The list of files
   */
  private async getListMethods(): Promise<NodeModel[] | undefined> {
    const files = await ListFilesController.getFiles();

    if (!files) {
      return;
    }

    // List of Controllers
    const nodes = files.filter((file) =>
      file.label.toString().includes('controller.ts'),
    );

    // Precompile decorator regex: start of line, ignore commented lines, allow indentation
    const decoratorRegex =
      /^(?!\s*\/\/).*\s*@(?:Get|Post|Put|Delete|Patch|Options|Head|All)\b/;

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

            if (decoratorRegex.test(line.text)) {
              node = new NodeModel(
                line.text.trim(),
                new ThemeIcon('symbol-method'),
                {
                  command: `${EXTENSION_ID}.list.gotoLine`,
                  title: line.text,
                  arguments: [uri, index],
                },
              );
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
      console.error('Errors processing controller files:', errors);
    }

    return results.filter((file) => file.children?.length !== 0);
  }
}
