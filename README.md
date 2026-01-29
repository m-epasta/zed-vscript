# VScript Extension for Zed

A comprehensive Zed extension for the VScript programming language, featuring advanced syntax highlighting, intelligent code completion, and powerful language server integration.

## Features

- 🎨 **Advanced Syntax Highlighting**: Tree-sitter based highlighting for VScript
- 🚀 **Language Server Integration**: Full LSP support with vscript-lsp
- 💡 **Intelligent Code Completion**: Context-aware suggestions and snippets
- 🎯 **Go-to Definition**: Navigate to symbol definitions across files
- 🔍 **Hover Information**: Rich type and documentation information
- 🚨 **Real-time Diagnostics**: Syntax and semantic error detection
- 📁 **Workspace Support**: Full project and module management
- 🔄 **Auto-formatting**: Built-in code formatting support

## Installation

### From Zed Extensions Gallery

1. Open Zed
2. Press `Cmd+Shift+P` (Mac) or `Ctrl+Shift+P` (Linux/Windows)
3. Type "Extensions" and select "Extensions: Open Extensions"
4. Search for "VScript"
5. Click "Install"

### Manual Installation

1. Clone this repository:
   ```bash
   git clone https://github.com/vscript/zed-vscript.git
   ```

2. Link the extension to Zed:
   ```bash
   ln -s $(pwd)/zed-vscript ~/.config/zed/extensions/vscript
   ```

3. Restart Zed

## Requirements

The extension automatically downloads and manages the VScript Language Server (`vscript-lsp`). No manual setup required!

For advanced users who want to use a custom LSP binary:

1. Install `vscript-lsp` manually:
   ```bash
   cargo install vscript-lsp
   ```

2. Make sure it's in your PATH or configure the path in Zed settings

## Configuration

The extension works out of the box, but you can customize its behavior through Zed's settings:

### Basic Configuration

```json
{
  "languages": {
    "VScript": {
      "tab_size": 4,
      "hard_tabs": false,
      "soft_wrap": "preferred_line_length",
      "preferred_line_length": 100
    }
  }
}
```

### Language Server Settings

```json
{
  "lsp": {
    "vscript-lsp": {
      "settings": {
        "vscript": {
          "diagnostics": {
            "enable": true,
            "unusedVariables": "warning"
          },
          "completion": {
            "enable": true,
            "autoImport": true
          },
          "hover": {
            "enable": true,
            "showDocumentation": true
          }
        }
      }
    }
  }
}
```

### Formatting

```json
{
  "languages": {
    "VScript": {
      "formatter": {
        "external": {
          "command": "vscript",
          "arguments": ["fmt", "--stdin"]
        }
      },
      "format_on_save": "on"
    }
  }
}
```

## VScript Language Support

### Syntax Highlighting

The extension provides comprehensive syntax highlighting for:

- Keywords (`fn`, `class`, `let`, `if`, `while`, etc.)
- Literals (strings, numbers, booleans, `nil`)
- Comments (line and block)
- Functions and methods
- Classes and inheritance
- Variables and parameters
- Operators and punctuation
- Decorators (`@[decorator]`)
- String interpolation (`"Hello ${name}"`)

### Code Completion

Intelligent completion for:

- **Keywords**: All VScript keywords
- **Built-in functions**: `print()`, `len()`, `push()`, etc.
- **Variables**: Local and global variables in scope
- **Functions**: User-defined functions with parameter hints
- **Methods**: Object methods with documentation
- **Imports**: Available modules and files
- **Decorators**: Common decorators like `@[cached]`, `@[debug]`

### Language Server Features

- **Go to Definition**: Jump to function, class, and variable definitions
- **Find References**: Find all usages of a symbol
- **Hover Information**: Type information and documentation
- **Document Symbols**: Outline view of functions, classes, and variables
- **Workspace Symbols**: Search symbols across the entire project
- **Diagnostics**: Real-time error and warning detection
- **Semantic Highlighting**: Advanced token-based highlighting

## VScript File Types

The extension recognizes files with the `.vs` extension as VScript files.

Example VScript code:

```vscript
// VScript example
import core:os as os
import core:json as json

@[cached]
fn fibonacci(n) {
    if n <= 1 {
        return n
    }
    return fibonacci(n - 1) + fibonacci(n - 2)
}

class Calculator {
    init(name) {
        this.name = name
    }

    add(a, b) {
        return a + b
    }
}

let calc = Calculator("MyCalc")
println("Result: ${calc.add(5, 3)}")
```

## Project Structure

VScript projects typically have a `v.mod` file in the root:

```
my-vscript-project/
├── v.mod
├── src/
│   ├── main.vs
│   ├── utils.vs
│   └── lib/
│       └── helper.vs
└── tests/
    └── test_main.vs
```

The extension automatically detects VScript projects and provides appropriate language server features.

## Troubleshooting

### Language Server Not Starting

1. Check Zed's output panel for error messages
2. Ensure you have internet connection (for automatic LSP download)
3. Try restarting Zed

### Syntax Highlighting Issues

1. Verify the file has a `.vs` extension
2. Check if the Tree-sitter grammar compiled correctly
3. Try reloading the window (`Cmd+R` / `Ctrl+R`)

### Completion Not Working

1. Make sure the language server is running (check status bar)
2. Verify your VScript syntax is correct
3. Check the LSP settings in Zed configuration

## Development

### Building the Extension

```bash
# Install dependencies
npm install

# Build the extension
npm run build

# Package for distribution
npm run package
```

### Tree-sitter Grammar

The extension includes a Tree-sitter grammar for VScript. To rebuild:

```bash
cd grammars/vscript
tree-sitter generate
tree-sitter build-wasm
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Test thoroughly with various VScript files
5. Commit your changes (`git commit -am 'Add amazing feature'`)
6. Push to the branch (`git push origin feature/amazing-feature`)
7. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Related Projects

- [VScript Compiler](../vscript) - The main VScript language implementation
- [VScript LSP](../vscript-lsp) - Language Server Protocol implementation
- [Tree-sitter VScript](https://github.com/vscript/tree-sitter-vscript) - Syntax highlighting grammar

## Support

- 📖 [VScript Documentation](https://vscript.dev/docs)
- 🐛 [Issue Tracker](https://github.com/vscript/zed-vscript/issues)
- 💬 [Discussions](https://github.com/vscript/zed-vscript/discussions)
- 🔧 [Zed Editor](https://zed.dev)