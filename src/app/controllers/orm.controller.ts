import { l10n } from 'vscode';
import { Config } from '../configs';
import { showError } from '../helpers';

export class ORMController {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  // Private properties
  /**
   * The list of ORM annotations.
   * @type {Record<string, string[]>}
   * @private
   * @memberof ORMController
   */
  private readonly orms: Readonly<Record<string, string[]>> = {
    mikroorm: [
      'Entity',
      'PrimaryKey',
      'Property',
      'ManyToOne',
      'OneToMany',
      'ManyToMany',
      'OneToOne',
      'Check',
      'Embeddable',
      'Embedded',
      'EnsureRequestContext',
      'Enum',
      'Filter',
      'Formula',
      'BeforeCreate',
      'AfterCreate',
      'BeforeUpdate',
      'AfterUpdate',
      'BeforeUpsert',
      'AfterUpsert',
      'OnInit',
      'OnLoad',
      'BeforeDelete',
      'AfterDelete',
      'Index',
      'Unique',
      'SerializedPrimaryKey',
      'Subscriber',
    ],
    mongoose: [
      'Schema',
      'Prop',
      'PropString',
      'PropNumber',
      'PropBoolean',
      'PropDate',
      'PropObjectId',
      'PropArray',
      'PropMap',
      'PropNested',
      'PropRef',
      'PropEnum',
      'PropRequired',
      'PropUnique',
      'PropIndex',
    ],
    sequelize: [
      'CreatedAt',
      'UpdatedAt',
      'DeletedAt',
      'Table',
      'AutoIncrement',
      'PrimaryKey',
      'Index',
      'Column',
      'AllowNull',
      'Unique',
      'Default',
      'Comment',
      'BeforeBulkCreate',
      'BeforeBulkDestroy',
      'BeforeBulkUpdate',
      'BeforeCreate',
      'BeforeDestroy',
      'BeforeSave',
      'BeforeUpdate',
      'BeforeUpsert',
      'BeforeValidate',
      'AfterBulkCreate',
      'AfterBulkDestroy',
      'AfterBulkUpdate',
      'AfterCreate',
      'AfterDestroy',
      'AfterSave',
      'AfterUpdate',
      'AfterUpsert',
      'AfterValidate',
      'HasMany',
      'HasOne',
      'ForeignKey',
      'BelongsTo',
      'BelongsToMany',
    ],
    typeorm: [
      'Column',
      'CreateDateColumn',
      'UpdateDateColumn',
      'DeleteDateColumn',
      'ObjectIdColumn',
      'PrimaryColumn',
      'PrimaryGeneratedColumn',
      'VersionColumn',
      'ViewColumn',
      'VirtualColumn',
      'ViewEntity',
      'ChildEntity',
      'Entity',
      'TableInheritance',
      'AfterInsert',
      'AfterLoad',
      'AfterRecover',
      'AfterRemove',
      'AfterSoftRemove',
      'AfterUpdate',
      'BeforeInsert',
      'BeforeRecover',
      'BeforeRemove',
      'BeforeSoftRemove',
      'BeforeUpdate',
      'EventSubscriber',
      'JoinColumn',
      'JoinTable',
      'ManyToMany',
      'ManyToOne',
      'OneToMany',
      'OneToOne',
      'RelationCount',
      'RelationId',
      'Tree',
      'TreeChildren',
      'TreeLevelColumn',
      'TreeParent',
    ],
  };

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the ORMController class.
   *
   * @constructor
   * @public
   * @memberof ORMController
   */
  constructor(private readonly config: Config) {}

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods
  /**
   * Returns the import regex.
   *
   * @function getAnnotationsRegex
   * @private
   * @memberof ListEntitiesProvider
   * @example
   * const importRegex = provider.getAnnotationsRegex();
   *
   * @returns {RegExp | undefined} - The import regex
   */
  getAnnotationsRegex(): RegExp | undefined {
    // Get the ORM annotations based on the configuration
    const annotations = this.orms[this.config.orm];

    // Return undefined if no annotations are found
    if (!annotations) {
      const message = l10n.t(
        'ORM annotations not found for {0}',
        this.config.orm,
      );
      showError(message);
      return;
    }

    // Escape special characters in annotations for regex
    const escapedAnnotations = annotations.map((annotation) =>
      annotation.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'),
    );

    // Construct regular expression pattern
    const importPattern = `@(${escapedAnnotations.join('|')})`;

    // Construct regular expression
    return new RegExp(importPattern);
  }
}
