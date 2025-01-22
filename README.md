# NestJS File Generator for VSCode

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/imgildev.vscode-nestjs-generator?style=for-the-badge&label=VS%20Marketplace&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-generator)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/imgildev.vscode-nestjs-generator?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-generator)
[![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/imgildev.vscode-nestjs-generator?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-generator)
[![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/imgildev.vscode-nestjs-generator?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-generator&ssr=false#review-details)
[![GitHub Repo stars](https://img.shields.io/github/stars/ManuelGil/vscode-nestjs-generator?style=for-the-badge&logo=github)](https://github.com/ManuelGil/vscode-nestjs-generator)
[![GitHub license](https://img.shields.io/github/license/ManuelGil/vscode-nestjs-generator?style=for-the-badge&logo=github)](https://github.com/ManuelGil/vscode-nestjs-generator/blob/main/LICENSE)

Are you tired of manually creating files for your NestJS projects in Visual Studio Code? We have the solution for you! Introducing the **NestJS File Generator** extension for VSCode.

![demo](https://raw.githubusercontent.com/ManuelGil/vscode-nestjs-generator/main/docs/images/demo.gif)

With this powerful extension, you can streamline your NestJS development workflow by generating files with just a few clicks. Whether you need a new class, controller, decorator, or any other NestJS component, our extension has you covered.

![banner](https://raw.githubusercontent.com/ManuelGil/vscode-nestjs-generator/main/docs/images/banner.png)

## Table of Contents

- [NestJS File Generator for VSCode](#nestjs-file-generator-for-vscode)
  - [Table of Contents](#table-of-contents)
  - [Requirements](#requirements)
  - [Project Settings](#project-settings)
  - [Settings Options](#settings-options)
  - [Features](#features)
  - [Follow Me](#follow-me)
  - [VSXpert Template](#vsxpert-template)
  - [Other Extensions](#other-extensions)
  - [Contributing](#contributing)
  - [Code of Conduct](#code-of-conduct)
  - [Changelog](#changelog)
  - [Authors](#authors)
  - [License](#license)

## Requirements

- VSCode 1.88.0 or later

## Project Settings

Configure your project by creating or updating a settings.json file at the project's root. If you already have a `.vscode/settings.json` file, skip the first two steps.

1. Open the command palette in VSCode:
   - `CTRL + SHIFT + P` (Windows)
   - `CMD + SHIFT + P` (Mac OS)

2. Type `Preferences: Open Workspace Settings (JSON)`.

3. In the `.vscode/settings.json` file, copy and paste the following settings:

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

| Title                                     | Purpose                                  |
| ----------------------------------------- | ---------------------------------------- |
| NestJS: Generate Class                    | Generates a new Class                    |
| NestJS: Generate Controller               | Generates a new Controller               |
| NestJS: Generate Decorator                | Generates a new Decorator                |
| NestJS: Generate Update Dto               | Generates a new Update Dto               |
| NestJS: Generate Exception                | Generates a new Exception                |
| NestJS: Generate Exception Filter         | Generates a new Exception Filter         |
| NestJS: Generate Filter                   | Generates a new Filter                   |
| NestJS: Generate Gateway                  | Generates a new Gateway                  |
| NestJS: Generate Guard                    | Generates a new Guard                    |
| NestJS: Generate Interceptor              | Generates a new Interceptor              |
| NestJS: Generate Interface                | Generates a new Interface                |
| NestJS: Generate Jwt Guard                | Generates a new Jwt Guard                |
| NestJS: Generate Jwt Strategy             | Generates a new Jwt Strategy             |
| NestJS: Generate Middleware               | Generates a new Middleware               |
| NestJS: Generate Logger                   | Generates a new Logger                   |
| NestJS: Generate Module                   | Generates a new Module                   |
| NestJS: Generate Pipe                     | Generates a new Pipe                     |
| NestJS: Generate Provider                 | Generates a new Provider                 |
| NestJS: Generate Resolver                 | Generates a new Resolver                 |
| NestJS: Generate Service                  | Generates a new Service                  |
| NestJS: Generate Test                     | Generates a new Test                     |
| NestJS: Generate Controller with CLI      | Generates a new Controller with CLI      |
| NestJS: Generate Gateway with CLI         | Generates a new Gateway with CLI         |
| NestJS: Generate Library with CLI         | Generates a new Library with CLI         |
| NestJS: Generate Module with CLI          | Generates a new Module with CLI          |
| NestJS: Generate Provider with CLI        | Generates a new Provider with CLI        |
| NestJS: Generate Resolver with CLI        | Generates a new Resolver with CLI        |
| NestJS: Generate Resource with CLI        | Generates a new Resource with CLI        |
| NestJS: Generate Service with CLI         | Generates a new Service with CLI         |
| NestJS: Generate Sub Application with CLI | Generates a new Sub Application with CLI |
| NestJS: Start Server                      | Launches the Nest Server                 |
| NestJS: Start Server (Dev mode)           | Launches the Nest Development Server     |
| NestJS: Start Server (Debug mode)         | Launches the Nest Debug Server           |
| NestJS: Start Server (Production mode)    | Launches the Nest Production Server      |

## Follow Me

If you enjoy using this extension, consider following me for updates on this and future projects:

[![GitHub followers](https://img.shields.io/github/followers/ManuelGil?style=for-the-badge&logo=github)](https://github.com/ManuelGil)
[![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/imgildev?style=for-the-badge&logo=x)](https://twitter.com/imgildev)

## VSXpert Template

This extension was created using [VSXpert](https://vsxpert.com), a template that helps you create Visual Studio Code extensions with ease. VSXpert provides a simple and easy-to-use structure to get you started quickly.

## Other Extensions

- [Angular File Generator](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-angular-generator)
- [NestJS File Generator](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-generator)
- [T3 Stack / NextJS / ReactJS File Generator](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nextjs-generator)
- [Auto Barrel](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-auto-barrel)
- [CodeIgniter 4 Spark](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-codeigniter4-spark)

## Contributing

NestJS File Generator for VSCode is open-source software, and we welcome contributions from the community. If you'd like to contribute, please fork the [GitHub repository](https://github.com/ManuelGil/vscode-nestjs-generator) and submit a pull request with your changes.

Before contributing, please read our [Contribution Guidelines](./CONTRIBUTING.md) for instructions on coding standards, testing, and more.

## Code of Conduct

We are committed to providing a friendly, safe, and welcoming environment for all, regardless of gender, sexual orientation, disability, ethnicity, religion, or similar personal characteristic. Please review our [Code of Conduct](./CODE_OF_CONDUCT.md) before participating in our community.

## Changelog

For a complete list of changes, see the [CHANGELOG.md](./CHANGELOG.md)

## Authors

- **Manuel Gil** - _Owner_ - [ManuelGil](https://github.com/ManuelGil)

See also the list of [contributors](https://github.com/ManuelGil/vscode-nestjs-generator/contributors) who participated in this project.

## License

NestJS File Generator for VSCode is licensed under the MIT License - see the [MIT License](https://opensource.org/licenses/MIT) for details.
