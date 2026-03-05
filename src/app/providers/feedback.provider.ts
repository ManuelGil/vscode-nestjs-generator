/**
 * @file Tree data provider that shows static feedback links (About Us, Report
 * Issues, Rate Us, Support Us) in the sidebar.
 */
import {
  Event,
  EventEmitter,
  l10n,
  ProviderResult,
  ThemeIcon,
  TreeDataProvider,
  TreeItem,
} from 'vscode';

import { CommandIds, EXTENSION_ID } from '../configs';
import { FeedbackController } from '../controllers';
import { NodeModel } from '../models';

/**
 * Provides a static tree of feedback and support links in the sidebar.
 * Unlike other providers, these entries are not derived from workspace files.
 *
 * @class
 * @implements {TreeDataProvider<NodeModel>}
 * @see https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider
 */
export class FeedbackProvider implements TreeDataProvider<NodeModel> {
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

  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the FeedbackProvider class.
   *
   * @constructor
   * @param controller - The feedback controller.
   */
  constructor(readonly controller: FeedbackController) {
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
    return element;
  }

  /**
   * Returns the children for the supplied element, or the static feedback
   * entries when no element is provided.
   *
   * @param element - Parent node, or undefined for root.
   * @returns The child nodes.
   * @see https://code.visualstudio.com/api/references/vscode-api#TreeDataProvider
   */
  getChildren(element?: NodeModel): ProviderResult<NodeModel[]> {
    if (element) {
      return element.children;
    }

    return this.getFeedbacks();
  }

  /** Signals VSCode to re-render the feedback tree. */
  refresh(): void {
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
   * Builds the static list of feedback and support tree items.
   * These entries are hardcoded (not derived from workspace files).
   *
   * @returns Static feedback nodes (About Us, Report Issues, Rate Us, Support Us).
   */
  private getFeedbacks(): NodeModel[] {
    return [
      new NodeModel(l10n.t('About Us'), new ThemeIcon('info'), {
        title: 'About Us',
        command: `${EXTENSION_ID}.${CommandIds.FeedbackAboutUs}`,
      }),
      new NodeModel(l10n.t('Report an Issues'), new ThemeIcon('bug'), {
        title: 'Report an Issues',
        command: `${EXTENSION_ID}.${CommandIds.FeedbackReportIssues}`,
      }),
      new NodeModel(l10n.t('Rate Us'), new ThemeIcon('star'), {
        title: 'Rate Us',
        command: `${EXTENSION_ID}.${CommandIds.FeedbackRateUs}`,
      }),
      new NodeModel(l10n.t('Support Us'), new ThemeIcon('heart'), {
        title: 'Support Us',
        command: `${EXTENSION_ID}.${CommandIds.FeedbackSupportUs}`,
      }),
    ];
  }
}
