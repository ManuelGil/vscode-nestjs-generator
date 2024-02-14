# NestJS File Generator for VSCode

[![Visual Studio Marketplace Version](https://img.shields.io/visual-studio-marketplace/v/imgildev.vscode-nestjs-generator?style=for-the-badge&label=VS%20Marketplace&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-generator)
[![Visual Studio Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/imgildev.vscode-nestjs-generator?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-generator)
[![Visual Studio Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/imgildev.vscode-nestjs-generator?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-generator)
[![Visual Studio Marketplace Rating](https://img.shields.io/visual-studio-marketplace/r/imgildev.vscode-nestjs-generator?style=for-the-badge&logo=visual-studio-code)](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-generator&ssr=false#review-details)
[![GitHub Repo stars](https://img.shields.io/github/stars/ManuelGil/vscode-nestjs-generator?style=for-the-badge&logo=github)](https://github.com/ManuelGil/vscode-nestjs-generator)
[![GitHub license](https://img.shields.io/github/license/ManuelGil/vscode-nestjs-generator?style=for-the-badge&logo=github)](https://github.com/ManuelGil/vscode-nestjs-generator/blob/main/LICENSE)

![banner](https://raw.githubusercontent.com/ManuelGil/vscode-nestjs-generator/main/docs/images/banner.png)

Are you tired of manually creating files for your NestJS projects in Visual Studio Code? We have the solution for you! Introducing the **NestJS File Generator** extension for VSCode.

![demo](https://raw.githubusercontent.com/ManuelGil/vscode-nestjs-generator/main/docs/images/demo.gif)

With this powerful extension, you can streamline your NestJS development workflow by generating files with just a few clicks. Whether you need a new class, controller, decorator, or any other NestJS component, our extension has you covered.

## Table of Contents

- [NestJS File Generator for VSCode](#nestjs-file-generator-for-vscode)
  - [Table of Contents](#table-of-contents)
  - [Requirements](#requirements)
  - [Project Settings](#project-settings)
  - [Features](#features)
  - [Connect with me](#connect-with-me)
  - [Other Extensions](#other-extensions)
  - [Changelog](#changelog)
  - [Authors](#authors)
  - [License](#license)

## Requirements

- VSCode 1.76.0 or later

## Project Settings

Configure your project by creating or updating a settings.json file at the project's root. If you already have a `.vscode/settings.json` file, skip the first two steps.

1. Open the command palette in VSCode:
   - `CTRL + SHIFT + P` (Windows)
   - `CMD + SHIFT + P` (Mac OS)

2. Type `Preferences: Open Workspace Settings (JSON)`.

3. In the `.vscode/settings.json` file, copy and paste the following settings:

    ```jsonc
    {
      "nestjs.files.include": [
        "ts"
      ],
      "nestjs.files.exclude": [
        "**/node_modules/**",
        "**/dist/**",
        "**/out/**",
        "**/build/**",
        "**/.*/**"
      ],
      "nestjs.files.watch": [
        "controllers",
        "dtos",
        "services"
      ]
    }
    ```

4. **Restart VS Code**

Your project is now set up to automatically format code upon saving.

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

## Connect with me

[![GitHub followers](https://img.shields.io/github/followers/ManuelGil?style=for-the-badge&logo=github)](https://github.com/ManuelGil)
[![X (formerly Twitter) Follow](https://img.shields.io/twitter/follow/imgildev?style=for-the-badge&logo=x)](https://twitter.com/imgildev)

## Other Extensions

- [NestJS File Generator](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-generator)
- [NestJS Snippets](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nestjs-snippets-extension)
- [Angular File Generator](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-angular-generator)
- [T3 Stack / NextJS / ReactJS File Generator](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-nextjs-generator)
- [CodeIgniter 4 Snippets](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-codeigniter4-snippets)
- [CodeIgniter 4 Shield Snippets](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-codeigniter4-shield-snippets)
- [CodeIgniter 4 Spark](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-codeigniter4-spark)
- [Moodle Pack](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-moodle-snippets)
- [Mustache Template Engine - Snippets & Autocomplete](https://marketplace.visualstudio.com/items?itemName=imgildev.vscode-mustache-snippets)

## Changelog

See [CHANGELOG.md](./CHANGELOG.md)

## Authors

- **Manuel Gil** - _Owner_ - [ManuelGil](https://github.com/ManuelGil)

See also the list of [contributors](https://github.com/ManuelGil/vscode-nestjs-generator/contributors) who participated in this project.

## License

NestJS File Generator for VSCode is licensed under the MIT License - see the [MIT License](https://opensource.org/licenses/MIT) for details.
