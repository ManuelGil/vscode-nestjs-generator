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
import { showError } from '../helpers';
import { NodeModel } from '../models';

enum ORM {
  miroorm = 'mikroorm',
  mongoose = 'mongoose',
  sequelize = 'sequelize',
  typeorm = 'typeorm',
}

type ORMAnnotations = {
  [key in ORM]: string[];
};

/**
 * The ListEntitiesProvider class
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
 * const provider = new ListEntitiesProvider();
 *
 * @see https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider
 */
export class ListEntitiesProvider implements TreeDataProvider<NodeModel> {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  // Public properties
  /**
   * The onDidChangeTreeData event.
   * @type {Event<NodeModel | undefined | null | void>}
   * @public
   * @memberof ListEntitiesProvider
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
   * @memberof ListEntitiesProvider
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
   * The ORM annotations.
   * @type {ORMAnnotations}
   * @private
   * @memberof ListEntitiesProvider
   * @example
   * this.orms = {
   *  [ORM.miroorm]: [
   *    // ...
   *  ],
   *  [ORM.mongoose]: [
   *    // ...
   *  ],
   *  [ORM.sequelize]: [
   *    // ...
   *  ],
   *  [ORM.typeorm]: [
   *    // ...
   *  ],
   * };
   */
  private orms: ORMAnnotations;

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the ListEntitiesProvider class
   *
   * @constructor
   * @public
   * @memberof ListEntitiesProvider
   */
  constructor(readonly controller: ListFilesController) {
    this._onDidChangeTreeData = new EventEmitter<
      NodeModel | undefined | null | void
    >();
    this.onDidChangeTreeData = this._onDidChangeTreeData.event;

    // Define ORM annotations
    this.orms = {
      [ORM.miroorm]: [
        '@Entity',
        '@PrimaryKey',
        '@Property',
        '@ManyToOne',
        '@OneToMany',
        '@ManyToMany',
        '@OneToOne',
        '@Check',
        '@Embeddable',
        '@Embedded',
        '@EnsureRequestContext',
        '@Enum',
        '@Filter',
        '@Formula',
        '@BeforeCreate',
        '@AfterCreate',
        '@BeforeUpdate',
        '@AfterUpdate',
        '@BeforeUpsert',
        '@AfterUpsert',
        '@OnInit',
        '@OnLoad',
        '@BeforeDelete',
        '@AfterDelete',
        '@Index',
        '@Unique',
        '@SerializedPrimaryKey',
        '@Subscriber',
      ],
      [ORM.mongoose]: [
        '@Schema',
        '@Prop',
        '@PropString',
        '@PropNumber',
        '@PropBoolean',
        '@PropDate',
        '@PropObjectId',
        '@PropArray',
        '@PropMap',
        '@PropNested',
        '@PropRef',
        '@PropEnum',
        '@PropRequired',
        '@PropUnique',
        '@PropIndex',
      ],
      [ORM.sequelize]: [
        '@CreatedAt',
        '@UpdatedAt',
        '@DeletedAt',
        '@Table',
        '@AutoIncrement',
        '@PrimaryKey',
        '@Index',
        '@Column',
        '@AllowNull',
        '@Unique',
        '@Default',
        '@Comment',
        '@BeforeBulkCreate',
        '@BeforeBulkDestroy',
        '@BeforeBulkUpdate',
        '@BeforeCreate',
        '@BeforeDestroy',
        '@BeforeSave',
        '@BeforeUpdate',
        '@BeforeUpsert',
        '@BeforeValidate',
        '@AfterBulkCreate',
        '@AfterBulkDestroy',
        '@AfterBulkUpdate',
        '@AfterCreate',
        '@AfterDestroy',
        '@AfterSave',
        '@AfterUpdate',
        '@AfterUpsert',
        '@AfterValidate',
        '@HasMany',
        '@HasOne',
        '@ForeignKey',
        '@BelongsTo',
        '@BelongsToMany',
      ],
      [ORM.typeorm]: [
        '@Column',
        '@CreateDateColumn',
        '@UpdateDateColumn',
        '@DeleteDateColumn',
        '@ObjectIdColumn',
        '@PrimaryColumn',
        '@PrimaryGeneratedColumn',
        '@VersionColumn',
        '@ViewColumn',
        '@VirtualColumn',
        '@ViewEntity',
        '@ChildEntity',
        '@Entity',
        '@TableInheritance',
        '@AfterInsert',
        '@AfterLoad',
        '@AfterRecover',
        '@AfterRemove',
        '@AfterSoftRemove',
        '@AfterUpdate',
        '@BeforeInsert',
        '@BeforeRecover',
        '@BeforeRemove',
        '@BeforeSoftRemove',
        '@BeforeUpdate',
        '@EventSubscriber',
        '@JoinColumn',
        '@JoinTable',
        '@ManyToMany',
        '@ManyToOne',
        '@OneToMany',
        '@OneToOne',
        '@RelationCount',
        '@RelationId',
        '@Tree',
        '@TreeChildren',
        '@TreeLevelColumn',
        '@TreeParent',
      ],
    };
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
   * @memberof ListEntitiesProvider
   * @example
   * const treeItem = provider.getTreeItem(element);
   *
   * @returns {TreeItem | Thenable<TreeItem>} - The tree item
   *
   * @see https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider
   */
  getTreeItem(element: NodeModel): TreeItem | Thenable<TreeItem> {
    return element;
  }

  /**
   * Returns the children for the supplied element.
   *
   * @function getChildren
   * @param {NodeModel} [element] - The element
   * @public
   * @memberof ListEntitiesProvider
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

    return this.getListEntities();
  }

  /**
   * Refreshes the tree data.
   *
   * @function refresh
   * @public
   * @memberof FeedbackProvider
   * @example
   * provider.refresh();
   *
   * @returns {void} - No return value
   */
  refresh(): void {
    this._onDidChangeTreeData.fire();
  }

  // Private methods
  /**
   * Returns the list of files.
   *
   * @function getListEntities
   * @private
   * @memberof ListEntitiesProvider
   * @example
   * const files = provider.getListEntities();
   *
   * @returns {Promise<NodeModel[] | undefined>} - The list of files
   */
  private async getListEntities(): Promise<NodeModel[] | undefined> {
    const files = await this.controller.getFiles();

    if (!files) {
      return;
    }

    const importRegex = this.getImportRegex();

    if (!importRegex) {
      return;
    }

    for (const file of files) {
      const document = await workspace.openTextDocument(
        file.resourceUri?.path ?? '',
      );

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
                command: `${EXTENSION_ID}.list.gotoLine`,
                title: line.text,
                arguments: [file.resourceUri, index],
              },
            );
          }

          return node;
        },
      );

      file.setChildren(
        children.filter((child) => child !== undefined) as NodeModel[],
      );
    }

    return files.filter((file) => file.children && file.children.length !== 0);
  }

  /**
   * Returns the import regex.
   *
   * @function getImportRegex
   * @private
   * @memberof ListEntitiesProvider
   * @example
   * const importRegex = provider.getImportRegex();
   *
   * @returns {RegExp | undefined} - The import regex
   */
  private getImportRegex(): RegExp | undefined {
    // Get the ORM annotations based on the controller's ORM configuration
    const selectedORM = this.orms[this.controller.config.orm as ORM];

    if (!selectedORM) {
      showError('Invalid ORM configuration');
      return;
    }

    // Escape special characters in annotations for regex
    const escapedAnnotations = selectedORM.map((annotation) =>
      annotation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    );

    // Construct regular expression
    const importRegex = new RegExp(escapedAnnotations.join('|'), 'g');

    return importRegex;
  }
}
