# Change Log

All notable changes to the "NestJS File Generator" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.15.0] - 2026-05-02

### Added

- Detect NestJS projects using `nest-cli.json`, and `project.json`
- Support monorepos and nested NestJS projects
- Show contextual hint for folder-based commands

### Changed

- Allow extension activation in any workspace
- Improve Nx detection by scanning all targets
- Use filesystem APIs for JSON parsing instead of VS Code document APIs
- Centralize command validation logic
- Replace unsafe config access with safe guards

### Fixed

- Fix detection issues in Nx-based NestJS workspaces
- Prevent runtime errors from undefined configuration
- Avoid repeated workspace scans by caching detection results

### [2.14.0] - 2026-04-08

### Added

- Introduce `workspaceRoot` property in Config class for improved workspace management.
- Add `toPosixPath` helper for consistent cross-platform path formatting.
- Implement `readFileContent` helper to read files efficiently without opening the editor.
- Add file system watchers to invalidate cache on file changes.

### Changed

- Refactor relative path resolution to support both root and standard contexts.
- Enhance file discovery logic with improved caching and filtering mechanisms.
- Update `saveFile` helper to ensure secure path validation and prevent directory traversal attacks.
- Improve error handling and user notifications across file operations.

## [2.13.0] - 2026-03-04

### Added

- Add `ExtensionRuntime` to centralize the extension activation flow

### Changed

- Improve extension activation logic and error handling
- Improve activation error messages to provide clearer feedback
- Improve variable naming in the relative path helper for better clarity and maintainability

### Removed

- Remove unnecessary workspace folder checks and configuration handling

## [2.12.1] - 2025-08-14

### Changed

- Update README.md and CHANGELOG.md for consistency
- Enhance `FeedbackProvider` with disposal methods to prevent memory leaks

## [2.12.0] - 2025-08-14

### Changed

- Add caching mechanism to `ListDTOsProvider`, `ListEntitiesProvider`, `ListFilesProvider`, `ListMethodsProvider`, and `ListModulesProvider` to improve performance by reducing redundant data fetching
- Implement dispose methods in all providers to clean up resources and prevent memory leaks
- Utilize PromisePool for concurrent processing of files in `ListDTOsProvider`, `ListEntitiesProvider`, `ListFilesProvider`, `ListMethodsProvider`, and `ListModulesProvider` to enhance efficiency
- Update the activate function in `extension.ts` to properly handle configuration changes and file events

## [2.11.0] - 2025-03-10

### Added

- Add `vscode-marketplace-client` dependency to check for extension updates and display a notification

### Changed

- Update the `extension.ts` file to use the new `vscode-marketplace-client` dependency
- Update Localization strings for the extension
- Improve warning and error messages for the extension

## [2.10.0] - 2025-01-07

### Added

- Add `submenu.templates` settings to customize the templates in the context menu
- Add localization for cancellation message

## [2.9.0] - 2025-01-06

### Added

- Add `enable` settings to enable or disable the extension

### Fixed

- Fix typos the file generation process

## [2.8.0] - 2024-12-23

### Added

- Add `fileGenerator.skipFolderConfirmation` settings to skip the folder confirmation when generating a file
- Add VS Code test configuration and update test scripts

### Changed

- Improve the file generation process to skip the folder confirmation when the setting is enabled
- Improve the welcome and update messages in the extension
- Update localization files to improve the translation of the extension
- Update the `extension.ts` file to observer to the configuration changes
- Update the `config.ts` file to use the new settings and observer to the configuration changes
- Upgrade dependencies to the latest versions available

## [2.7.0] - 2024-11-23

### Added

- Add Customizable Working Directory setting to set the working directory for the extension
- Add version extension check to show a message when the extension is outdated

## [2.6.0] - 2024-11-11

### Added

- Add Spanish language support to the extension.
- Add convert json to ts command

## [2.5.0] - 2024-06-29

### Added

- Add `submenu.activateItem` settings to enable or disable the items in the context menu
- Add `submenu.customCommands` settings to customize the commands in the context menu
- Add `generateCustomElement` command to generate a custom element

### Changed

- Update the `extension.ts` file to use the new `submenu.activateItem` settings
- Update the `extension.ts` file to use the new `submenu.customCommands` settings
- Update the `package.json` file to include the new settings

## [2.4.0] - 2024-04-05

### Added

- Add List of DTOs View to show the list of DTOs in the project
- Add `DTOController` to list the annotations of the DTOs in the project
- Add `ORMController` to list the entities in the project

### Changed

- Update the `getFiles` method in the `ListFilesController` so that it can be used without instantiating the class
- Update the `ListFilesProvider` and `ListRoutesProvider` to use the new `getFiles` method
- Update the `ListEntityProvider` to use the new `ORMController` class
- Upgrade dependencies to the latest versions available

## [2.3.1] - 2024-03-17

### Fixed

- Fix the regex pattern to match the http methods in the `ListMethodProvider` class
- Fix the regex pattern to match the ORM entity in the `ListEntityProvider` class
- Fix the refresh of the list of files view when a file is created

## [2.3.0] - 2024-03-05

### Added

- Add List of Entities View
- Add Show Path In File Name setting to show the path in the file name

### Changed

- Update the `ListFileController` class to use the `showPath` setting

## [2.2.3] - 2024-02-22

### Fixed

- Fix the regex pattern to match the folder name to generate the file
- Fix empty list of files view when there are no files to show a welcome message
- Fix the documentation of the extension

## [2.2.2] - 2024-02-17

### Fixed

- Fix sorting of files in the list of files view to show alphabetically the files
- Fix action to save the file in the `autoImport` method in the `FileController` class
- Fix empty list of HTTP methods view when there are no HTTP methods to show a welcome message
- Fix empty list of modules view when there are no modules to show a welcome message
- Fix empty list of files view when there are no files to show a welcome message

## [2.2.1] - 2024-02-16

### Fixed

- Fix the `autoImport` method in the `FileController` class

## [2.2.0] - 2024-02-15

### Added

- Add `autoImport` setting to automatically import the generated files

### Changed

- Update the `FileController` class to use the `autoImport` method
- Update the `extension.ts` file to use the `showCollapseAll` option in the `TreeView` constructor

## [2.1.0] - 2024-02-13

### Added

- Add List of Modules View
- Add Counter to the List of Files View

### Changed

- Update commands to use the List of Modules View

## [2.0.1] - 2024-02-12

### Fixed

- Fix the link to the logo in the Activity Bar

## [2.0.0] - 2024-02-12

### Added

- Add Generate Interface command
- Add Generates a new Controller with CLI command
- Add Generates a new Gateway with CLI command
- Add Generates a new Library with CLI command
- Add Generates a new Module with CLI command
- Add Generates a new Provider with CLI command
- Add Generates a new Resolver with CLI command
- Add Generates a new Resource with CLI command
- Add Generates a new Service with CLI command
- Add Generates a new Sub Application with CLI command
- Add List of HTTP Methods View
- Add List of Files View
- Add Feedback View
- Add file includes section to the settings
- Add file excludes section to the settings
- Add file to watch section to the settings
- Add compodoc dependencies for the documentation generation

### Changed

- Refactor the folder structure of the extension to improve the codebase
- Improve the generation of the files to use the new folder structure
- Upgrade dependencies to the latest versions available
- Update settings to use the new folder structure
- Improve the documentation of the extension

### Fixed

- Fix issues related to the new folder structure

## [1.4.2] - 2023-12-30

### Fixed

- Improve documentation

## [1.4.1] - 2023-12-22

### Fixed

- Fix title of the context menu

## [1.4.0] - 2023-12-22

### Changed

- Improve context menus

## [1.3.0] - 2023-12-15

### Changed

- Update README.md and icon.png

## [1.2.0] - 2023-09-15

### Added

- Add Context menus
- Add lint-staged to pre-commit hook

### Changed

- Refactor code
- Update dependencies

### Fixed

- Fix Class generation

## [1.1.0] - 2023-09-14

### Added

- Add Server commands
- Improve file naming

## [1.0.1] - 2023-09-13

### Fixed

- Fix Typos

## [1.0.0] - 2023-09-13

- Initial release

[unreleased]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.15.0...HEAD
[2.15.0]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.14.0...v2.15.0
[2.14.0]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.13.0...v2.14.0
[2.13.0]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.12.1...v2.13.0
[2.12.1]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.12.0...v2.12.1
[2.12.0]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.11.0...v2.12.0
[2.11.0]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.10.0...v2.11.0
[2.10.0]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.9.0...v2.10.0
[2.9.0]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.8.0...v2.9.0
[2.8.0]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.7.0...v2.8.0
[2.7.0]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.6.0...v2.7.0
[2.6.0]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.5.0...v2.6.0
[2.5.0]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.4.0...v2.5.0
[2.4.0]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.3.1...v2.4.0
[2.3.1]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.3.0...v2.3.1
[2.3.0]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.2.3...v2.3.0
[2.2.3]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.2.2...v2.2.3
[2.2.2]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.2.1...v2.2.2
[2.2.1]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.2.0...v2.2.1
[2.2.0]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.1.0...v2.2.0
[2.1.0]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.0.1...v2.1.0
[2.0.1]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.0.0...v2.0.1
[2.0.0]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v1.4.2...v2.0.0
[1.4.2]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v1.4.1...v1.4.2
[1.4.1]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v1.4.0...v1.4.1
[1.4.0]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v1.3.0...v1.4.0
[1.3.0]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v1.2.0...v1.3.0
[1.2.0]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v1.1.0...v1.2.0
[1.1.0]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v1.0.1...v1.1.0
[1.0.1]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v1.0.0...v1.0.1
[1.0.0]: https://github.com/ManuelGil/vscode-nestjs-generator/releases/tag/v1.0.0
