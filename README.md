# NestJS File Generator

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/imgildev.vscode-nestjs-generator?style=for-the-badge&label=VS%20Marketplace&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-generator)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/imgildev.vscode-nestjs-generator?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-generator)
[![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/imgildev.vscode-nestjs-generator?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-generator)
[![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/imgildev.vscode-nestjs-generator?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-generator&ssr=false#review-details)
[![GitHub Repo stars](https://img.shields.io/github/stars/ManuelGil/vscode-nestjs-generator?style=for-the-badge&logo=github)](https://github.com/ManuelGil/vscode-nestjs-generator)
[![GitHub license](https://img.shields.io/github/license/ManuelGil/vscode-nestjs-generator?style=for-the-badge&logo=github)](https://github.com/ManuelGil/vscode-nestjs-generator/blob/main/LICENSE)

> Generate NestJS files and boilerplate directly from VS Code - controllers, services, modules, decorators, CLI templates and more.

## Overview

**NestJS File Generator** helps you speed up NestJS development by creating common files and scaffolding directly inside Visual Studio Code. It provides a Sidebar explorer, customizable templates and CLI command integration so you can generate files and run Nest commands without leaving the editor.

![demo](https://raw.githubusercontent.com/ManuelGil/vscode-nestjs-generator/main/docs/images/demo.gif)

## Table of Contents

- [NestJS File Generator](#nestjs-file-generator)
  - [Overview](#overview)
  - [Table of Contents](#table-of-contents)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Project Settings](#project-settings)
  - [Settings Options](#settings-options)
  - [Features](#features)
  - [Quick Start](#quick-start)
  - [Contributing](#contributing)
  - [Changelog](#changelog)
  - [Authors](#authors)
  - [Follow Me](#follow-me)
  - [Other Extensions](#other-extensions)
  - [Recommended Browser Extension](#recommended-browser-extension)
  - [License](#license)

## Requirements

- Visual Studio Code 1.88.0 or later

## Installation

1. Open Visual Studio Code.
2. Go to the **Extensions** view (`Ctrl+Shift+X` / `Cmd+Shift+X` on macOS).
3. Search for **NestJS File Generator** (or install from the [Marketplace page](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-generator)).
4. Click **Install** and reload the editor if prompted.

## Project Settings

You can configure the extension per-project by adding a `.vscode/settings.json` file. The example below shows recommended options and customization points used by the extension:

    ```jsonc
    {
      "nestjs.enable": true, // Enable or disable the extension
      "nestjs.files.include": [
        "ts"
      ], // The list of extensions to include in the Sidebar Nest File Generator
      "nestjs.files.exclude": [
        "**/node_modules/**",
        "**/dist/**",
        "**/out/**",
        "**/build/**",
        "**/.*/**"
      ], // Glob patterns of files or folders to exclude in the Sidebar Nest File Generator
      "nestjs.files.watch": [
        "controllers",
        "dtos",
        "services"
      ], // The list of types of files to watch in the Sidebar Nest File Generator
      "nestjs.files.showPath": true, // Show the path in the list of files in the Sidebar Nest File Generator
      "nestjs.terminal.cwd": "/path/to/your/project", // Sets the current working directory for the terminal
      "nestjs.submenu.customCommands": [
        {
          "name": "Template 1",
          "command": "nest g co",
          "args": "--flat"
        },
        {
          "name": "Template 2",
          "command": "nest g co",
          "args": "--no-flat"
        }
      ], // The list of custom commands to execute in the custom command submenu
      "nestjs.submenu.templates": [
        {
          "name": "Template 1",
          "description": "Description of Template 1",
          "type": "controller",
          "template": [
            "import { Controller } from '@nestjs/common';",
            "",
            "@Controller('template1')",
            "export class Template1Controller {",
            "}"
          ]
        }
      ], // The list of templates to use when generating a new file
      "nestjs.submenu.activateItem": {
        "file": {
          "class": true,
          "controller": true,
          "decorator": true,
          "dto": true,
          "exception": true,
          "exceptionFilter": true,
          "filter": true,
          "gateway": true,
          "guard": true,
          "interceptor": true,
          "interface": true,
          "jwtGuard": true,
          "jwtStrategy": true,
          "middleware": true,
          "logger": true,
          "module": true,
          "pipe": true,
          "provider": true,
          "resolver": true,
          "service": true,
          "test": true,
          "template": true
        },
        "terminal": {
          "controller": true,
          "gateway": true,
          "library": true,
          "module": true,
          "provider": true,
          "resolver": true,
          "resource": true,
          "service": true,
          "custom": true,
          "start": true,
          "startDev": true,
          "startDebug": true,
          "startProd": true
        }
      }, // Activate items in the submenu
      "nestjs.files.autoImport": true, // Automatically import the generated file
      "nestjs.files.skipFolderConfirmation": false, // Skip folder confirmation when generating a new file
      "nestjs.files.orm": "typeorm", // The ORM to use when generating a new file
    }
    ```

4. **Restart VS Code**

Your project is now set up to automatically format code upon saving.

## Settings Options

Configure the Nest File Generator extension to suit your needs. The following settings are available:

- `nestjs.enable`: Enable or disable the extension. The default is `true`.
- `nestjs.files.include`: The list of extensions to include in the Sidebar Nest File Generator. The default is `ts`.
- `nestjs.files.exclude`: Glob patterns of files or folders to exclude in the Sidebar Nest File Generator. The default is `**/node_modules/**`, `**/dist/**`, `**/out/**`, `**/build/**`, and `**/.*/**`.
- `nestjs.files.watch`: The list of types of files to watch in the Sidebar Nest File Generator. The default is `controllers`, `dtos`, and `services`.
- `nestjs.files.showPath`: Show the path in the list of files in the Sidebar Nest File Generator. The default is `true`.
- `nestjs.terminal.cwd`: Sets the current working directory for the terminal. The directory must be an absolute path. The default is empty.
- `nestjs.submenu.customCommands`: The list of custom commands to execute in the custom command submenu. The default is `[]`.
- `nestjs.submenu.templates`: The list of templates to use when generating a new file. The default is `[]`.
- `nestjs.submenu.activateItem`: Activate items in the submenu. The default is `true`.
- `nestjs.files.autoImport`: Automatically import the generated file. The default is `true`.
- `nestjs.files.skipFolderConfirmation`: Skip folder confirmation when generating a new file. The default is `false`.
- `nestjs.files.orm`: The ORM to use when generating a new file. The default is `typeorm`.

The `nestjs.submenu.customCommands` setting is an array of objects with the following properties:

- `name`: The name of the command. Example: "Template 1".
- `command`: The command to execute. Example: "ng g c".
- `args`: The arguments to pass to the command. Example: "--style css --standalone true --inline-style --inline-template".

The `nestjs.submenu.templates` setting is an array of objects with the following properties:

- `name`: The name of the template. Example: "Service".
- `description`: A description of the template. Example: "Creates a service file".
- `type`: The type of component. Example: "service".
- `template`: The template content for the file. Use `{{ComponentName}}` as a placeholder for the component name and `{{EntityName}}` for the lowercase component name or any other placeholder you want to use.

For more information on configuring the Nest File Generator extension, see the [Project Settings](#project-settings) section.

## Features

Generate many common NestJS artifacts from the Sidebar or Command Palette:

- Generate classes, controllers, services, modules, providers, pipes, guards, interceptors, filters, middlewares, loggers, decorators, DTOs and tests.
- Run Nest CLI commands from the submenu (generate controller/module/service/resource/etc.).
- Custom templates: create and reuse your own file templates (Mustache-like placeholders allowed).
- Custom commands: add frequently used CLI commands to the submenu.
- Sidebar explorer: quick access to detected Nest files and templates in the workspace.
- Auto-import: automatically add imports for generated symbols.
- CLI terminal helpers: launch and control `start`, `start:dev`, `start:prod`, `start:debug` and other scripts from the extension.
- File watching: customize which kinds of files are tracked by the Sidebar.

## Quick Start

- Open Command Palette (`Ctrl+Shift+P` / `Cmd+Shift+P`) → **NestJS: Generate** and choose the artifact type.
- Use the Sidebar Nest File Generator to browse templates and generate files into a selected folder.
- Use custom templates or CLI commands defined in settings for project-specific scaffolding.

## Contributing

Contributions to the NestJS File Generator are welcome and appreciated. To contribute:

1. Fork the [GitHub repository](https://github.com/ManuelGil/vscode-nestjs-generator).
2. Create a new branch for your feature or fix:

   ```bash
   git checkout -b feature/your-feature
   ```

3. Make your changes, commit them, and push to your fork.
4. Submit a Pull Request targeting the `main` branch.

Before contributing, please review the [Contribution Guidelines](https://github.com/ManuelGil/vscode-nestjs-generator/blob/main/CONTRIBUTING.md) for coding standards, testing, and commit message conventions. If you encounter a bug or wish to request a new feature, please open an Issue.

## Changelog

For a complete list of changes, see the [CHANGELOG.md](https://github.com/ManuelGil/vscode-nestjs-generator/blob/main/CHANGELOG.md).

## Authors

- **Manuel Gil** - _Owner_ - [@ManuelGil](https://github.com/ManuelGil)

For a complete list of contributors, please refer to the [contributors](https://github.com/ManuelGil/vscode-nestjs-generator/contributors) page.

## Follow Me

- **GitHub**: [![GitHub followers](https://img.shields.io/github/followers/ManuelGil?style=for-the-badge\&logo=github)](https://github.com/ManuelGil)
- **X (formerly Twitter)**: [![X Follow](https://img.shields.io/twitter/follow/imgildev?style=for-the-badge\&logo=x)](https://twitter.com/imgildev)

## Other Extensions

- **[Auto Barrel](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-auto-barrel)**
  Automatically generates and maintains barrel (`index.ts`) files for your TypeScript projects.

- **[Angular File Generator](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-angular-generator)**
  Generates boilerplate and navigates your Angular (9→20+) project from within the editor, with commands for components, services, directives, modules, pipes, guards, reactive snippets, and JSON2TS transformations.

- **[NestJS File Generator](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-generator)**
  Simplifies creation of controllers, services, modules, and more for NestJS projects, with custom commands and Swagger snippets.

- **[NestJS Snippets](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-snippets-extension)**
  Ready-to-use code patterns for creating controllers, services, modules, DTOs, filters, interceptors, and more in NestJS.

- **[T3 Stack / NextJS / ReactJS File Generator](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nextjs-generator)**
  Automates file creation (components, pages, hooks, API routes, etc.) in T3 Stack (Next.js, React) projects and can start your dev server from VSCode.

- **[Drizzle ORM Snippets](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-drizzle-snippets)**
  Collection of code snippets to speed up Drizzle ORM usage, defines schemas, migrations, and common database operations in TypeScript/JavaScript.

- **[CodeIgniter 4 Spark](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-codeigniter4-spark)**
  Scaffolds controllers, models, migrations, libraries, and CLI commands in CodeIgniter 4 projects using Spark, directly from the editor.

- **[CodeIgniter 4 Snippets](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-codeigniter4-snippets)**
  Snippets for accelerating development with CodeIgniter 4, including controllers, models, validations, and more.

- **[CodeIgniter 4 Shield Snippets](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-codeigniter4-shield-snippets)**
  Snippets tailored to CodeIgniter 4 Shield for faster authentication and security-related code.

- **[Mustache Template Engine - Snippets & Autocomplete](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-mustache-snippets)**
  Snippets and autocomplete support for Mustache templates, making HTML templating faster and more reliable.

## Recommended Browser Extension

For developers who work with `.vsix` files for offline installations or distribution, the complementary [**One-Click VSIX**](https://chromewebstore.google.com/detail/imojppdbcecfpeafjagncfplelddhigc?utm_source=item-share-cb) extension is recommended, available for both Chrome and Firefox.

> **One-Click VSIX** integrates a direct "Download Extension" button into each VSCode Marketplace page, ensuring the file is saved with the `.vsix` extension, even if the server provides a `.zip` archive. This simplifies the process of installing or sharing extensions offline by eliminating the need for manual file renaming.

- [Get One-Click VSIX for Chrome &rarr;](https://chromewebstore.google.com/detail/imojppdbcecfpeafjagncfplelddhigc?utm_source=item-share-cb)
- [Get One-Click VSIX for Firefox &rarr;](https://addons.mozilla.org/es-ES/firefox/addon/one-click-vsix/)

## License

This project is licensed under the **MIT License**. See the [LICENSE](https://github.com/ManuelGil/vscode-nestjs-generator/blob/main/LICENSE) file for full details.
