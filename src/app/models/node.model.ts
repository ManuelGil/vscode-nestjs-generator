/**
 * @file Hierarchical tree item model used by all sidebar tree data providers.
 */
import {
  Command,
  ThemeIcon,
  TreeItem,
  TreeItemCollapsibleState,
  TreeItemLabel,
  Uri,
} from 'vscode';

/**
 * Extended TreeItem that supports hierarchical trees with child nodes.
 * The collapsibleState is automatically set to Expanded when children are
 * provided, or None otherwise.
 *
 * @class
 * @extends {TreeItem}
 * @see https://code.visualstudio.com/api/references/vscode-api#TreeItem
 */
export class NodeModel extends TreeItem {
  // -----------------------------------------------------------------
  // Properties
  // -----------------------------------------------------------------

  // Public properties
  /** Child nodes for hierarchical tree views. */
  children?: NodeModel[];

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Creates a new NodeModel.
   *
   * @constructor
   * @param label - Display label for the tree item.
   * @param iconPath - Icon shown next to the label.
   * @param command - Command executed when the item is clicked.
   * @param resourceUri - Associated file URI (enables file-based decorations).
   * @param contextValue - Context key for when-clause filtering in package.json.
   * @param children - Child nodes; when provided, the item is auto-expanded.
   */
  constructor(
    readonly label: string | TreeItemLabel,
    readonly iconPath?: string | Uri | { light: Uri; dark: Uri } | ThemeIcon,
    readonly command?: Command,
    readonly resourceUri?: Uri,
    readonly contextValue?: string,
    children?: NodeModel[],
  ) {
    super(
      label,
      children
        ? TreeItemCollapsibleState.Expanded
        : TreeItemCollapsibleState.None,
    );
    this.iconPath = iconPath;
    this.resourceUri = resourceUri;
    this.command = command;
    this.contextValue = contextValue;
    this.children = children;
  }

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods
  /**
   * Replaces the children and switches collapsibleState to Expanded so the
   * node can be opened in the tree view.
   *
   * @param children - The new child nodes.
   */
  setChildren(children: NodeModel[]): void {
    this.collapsibleState = TreeItemCollapsibleState.Expanded;
    this.children = children;
  }

  /**
   * Returns whether this node has any children.
   *
   * @returns True if at least one child exists.
   */
  hasChildren(): boolean {
    return !!(this.children && this.children.length);
  }
}
