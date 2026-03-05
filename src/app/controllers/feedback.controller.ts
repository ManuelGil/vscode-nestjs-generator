/**
 * @file Handles user engagement actions: opening the VS Marketplace page,
 * filing issues on GitHub, rating the extension, and sponsorship links.
 *
 * @module controllers/feedback
 */
import { env, l10n, MessageItem, Uri, window } from 'vscode';

import {
  EXTENSION_DISPLAY_NAME,
  EXTENSION_MARKETPLACE_URL,
  EXTENSION_PAYPAL_URL,
  EXTENSION_REPOSITORY_URL,
  EXTENSION_SPONSOR_URL,
} from '../configs';

/**
 * Opens external URLs for marketplace, issue reporting, rating, and
 * sponsorship actions.
 *
 * @class
 * @export
 * @public
 */
export class FeedbackController {
  // -----------------------------------------------------------------
  // Constructor
  // -----------------------------------------------------------------

  /**
   * Constructor for the FeedbackController class.
   *
   * @constructor
   * @public
   * @memberof FeedbackController
   */
  constructor() {}

  // -----------------------------------------------------------------
  // Methods
  // -----------------------------------------------------------------

  // Public methods
  /**
   * The aboutUs method.
   *
   * @function aboutUs
   * @public
   * @memberof FeedbackController
   *
   * @returns {void} - No return value
   */
  aboutUs(): void {
    env.openExternal(Uri.parse(EXTENSION_MARKETPLACE_URL));
  }

  /**
   * The reportIssues method.
   *
   * @function reportIssues
   * @public
   * @memberof FeedbackController
   *
   * @returns {void} - No return value
   */
  reportIssues(): void {
    env.openExternal(Uri.parse(`${EXTENSION_REPOSITORY_URL}/issues`));
  }

  /**
   * The rateUs method.
   *
   * @function rateUs
   * @public
   * @memberof FeedbackController
   *
   * @returns {void} - No return value
   */
  rateUs(): void {
    env.openExternal(
      Uri.parse(`${EXTENSION_MARKETPLACE_URL}&ssr=false#review-details`),
    );
  }

  /**
   * The supportUs method.
   *
   * @function supportUs
   * @public
   * @async
   * @memberof FeedbackController
   *
   * @returns {Promise<void>} - The promise that resolves with no value
   */
  async supportUs(): Promise<void> {
    // Create the actions
    const actions: MessageItem[] = [
      { title: l10n.t('Become a Sponsor') },
      { title: l10n.t('Buy Me a Coffee') },
    ];

    // Show the message
    const message = l10n.t(
      'Although {0} is offered at no cost, your support is deeply appreciated if you find it beneficial. Thank you for considering!',
      EXTENSION_DISPLAY_NAME,
    );
    const option = await window.showInformationMessage(message, ...actions);

    // Handle the actions
    switch (option?.title) {
      case actions[0].title:
        env.openExternal(Uri.parse(EXTENSION_SPONSOR_URL));
        break;

      case actions[1].title:
        env.openExternal(Uri.parse(EXTENSION_PAYPAL_URL));
        break;
    }
  }
}
