# Change Log

All notable changes to the "NestJS File Generator for VSCode" extension will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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

[unreleased]: https://github.com/ManuelGil/vscode-nestjs-generator/compare/v2.2.3...HEAD
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
