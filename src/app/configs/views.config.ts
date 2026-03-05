/**
 * @file View identifier constants for the NestJS File Generator extension.
 */

/**
 * Tree-view IDs registered by the extension for sidebar panels.
 * Each value is the short suffix appended to {@link EXTENSION_ID}
 * when creating tree views (e.g. `nestjs.listFilesView`).
 */
export enum ViewIds {
  ListFilesView = 'listFilesView',
  ListModulesView = 'listModulesView',
  ListEntitiesView = 'listEntitiesView',
  ListDTOsView = 'listDTOsView',
  ListMethodsView = 'listMethodsView',
  FeedbackView = 'feedbackView',
}
