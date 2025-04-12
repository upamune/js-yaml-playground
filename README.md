# YAML Playground

![logo](.github/assets/logo.jpg)

An interactive web application for experimenting with YAML conversion options. This playground allows you to convert JSON to YAML using different libraries and customize the output with various formatting options.

## Features

- Convert JSON to YAML in real-time
- Switch between two YAML libraries:
  - [js-yaml](https://github.com/nodeca/js-yaml) - Popular JavaScript YAML parser and serializer
  - [yaml](https://github.com/eemeli/yaml) (eemeli/yaml) - A definitive library for YAML parsing and serialization
- Customize numerous formatting options for each library
- Instant preview of the YAML output

## Demo

- [Live Demo on GitHub Pages](https://upamune.github.io/js-yaml-playground/)
- [Edit in StackBlitz](https://stackblitz.com/~/github.com/upamune/js-yaml-playground)

## Technologies Used

- React with TypeScript
- Vite for build tooling
- Tailwind CSS for styling
- Headless UI components
- js-yaml and yaml libraries

## Getting Started

### Prerequisites

- Node.js v22.14.0 (as specified in .npmrc)
- pnpm v10.8.0 (as specified in package.json)

### Installation

```bash
# Clone the repository
git clone https://github.com/upamune/js-yaml-playground.git
cd js-yaml-playground

# Install dependencies
pnpm install

# Start the development server
pnpm dev
```

The application will be available at http://localhost:5173/

### Building for Production

```bash
pnpm build
```

The built files will be in the `dist` directory.

## Available Options

### js-yaml Options

- **Indent**: Number of spaces to use for indentation
- **No Array Indent**: Don't indent arrays
- **Skip Invalid**: Skip invalid objects instead of throwing
- **Flow Level**: Controls flow style for collections
- **Sort Keys**: Sort object keys
- **Line Width**: Set max line width
- **No Refs**: Don't apply references
- **No Compat Mode**: Disable compatibility mode
- **Condense Flow**: Condense flow collections
- **Quoting Type**: Single or double quotes
- **Force Quotes**: Always quote strings

### yaml (eemeli/yaml) Options

- **Indent**: Number of spaces to use for indentation
- **Indent Sequences**: Indent sequences
- **Simple Keys**: Use simple keys
- **Line Width**: Set max line width
- **Min Content Width**: Minimum content width
- **Sort Map Entries**: Sort map entries
- **Double Quoted As JSON**: Format double-quoted strings as JSON
- **Single Quote**: Use single quotes
- **Block Quote**: Use block quotes
- **Collection Style**: Collection style (any, block, flow)
- **Default String Type**: Default string type
- **Default Key Type**: Default key type
- And many more...

## Deployment

This project is automatically deployed to GitHub Pages using GitHub Actions. Any push to the main branch triggers a build and deployment workflow.

## License

MIT