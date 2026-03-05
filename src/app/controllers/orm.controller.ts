/**
 * @file Provides ORM-specific decorator/annotation regex patterns used by
 * {@link ListEntitiesProvider} to identify entity files in the workspace.
 *
 * Supports TypeORM, Sequelize, MikroORM, and Mongoose.
 *
 * @module controllers/orm
 */
import { l10n } from 'vscode';
import { Config } from '../configs';
import { showError } from '../helpers';

/**
 * Holds ORM-specific decorator lists and builds a regex pattern that
 * {@link ListEntitiesProvider} uses to scan workspace files for entity
 * annotations. The active ORM is determined by the user's configuration.
 *
 * @class
 * @export
 * @public
 */
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
   * @public
   * @memberof ORMController
   *
   * @returns {RegExp | undefined} A regex matching ORM decorators, or undefined if the configured ORM is unknown.
   */
  getAnnotationsRegex(): RegExp | undefined {
    const annotations = this.orms[this.config.orm];

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

    // Construct regular expression pattern: anchor to start, ignore comments, allow indentation, add word boundary
    const importPattern = `^(?!\\s*\\/\\/)\\s*@(${escapedAnnotations.join(
      '|',
    )})\\b`;

    return new RegExp(importPattern);
  }
}
