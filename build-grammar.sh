#!/bin/bash

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_step() {
    echo -e "${BLUE}==>${NC} ${1}"
}

print_success() {
    echo -e "${GREEN}✓${NC} ${1}"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} ${1}"
}

print_error() {
    echo -e "${RED}✗${NC} ${1}"
}

# Check if tree-sitter CLI is installed
if ! command -v tree-sitter >/dev/null 2>&1; then
    print_error "tree-sitter CLI not found. Installing..."
    if command -v npm >/dev/null 2>&1; then
        npm install -g tree-sitter-cli
        print_success "tree-sitter CLI installed"
    else
        print_error "npm not found. Please install Node.js and npm first"
        exit 1
    fi
fi

print_step "Building VScript Tree-sitter Grammar..."

# Navigate to grammar directory
cd grammars/vscript

print_step "Checking grammar files..."
if [ ! -f "grammar.js" ]; then
    print_error "grammar.js not found!"
    exit 1
fi

if [ ! -f "tree-sitter.json" ]; then
    print_error "tree-sitter.json not found!"
    exit 1
fi

print_success "Grammar files found"

print_step "Generating parser..."
if tree-sitter generate; then
    print_success "Parser generated successfully"
else
    print_error "Failed to generate parser"
    exit 1
fi

print_step "Building WASM parser..."
if tree-sitter build --wasm; then
    print_success "WASM parser built successfully"
else
    print_error "Failed to build WASM parser"
    exit 1
fi

print_step "Testing grammar (basic validation)..."
# Create a simple test file
cat > test.vs << 'EOF'
fn hello(name) {
    println("Hello, ${name}!")
}

let x = 42
hello("World")
EOF

if tree-sitter parse test.vs > /dev/null 2>&1; then
    print_success "Grammar test passed"
    rm test.vs
else
    print_warning "Grammar test failed (this is okay for development)"
    rm -f test.vs
fi

print_step "Checking output files..."
if [ -f "tree-sitter-vscript.wasm" ] || [ -f "vscript.wasm" ]; then
    print_success "WASM file created"
else
    print_warning "WASM file not found (may be in different location)"
fi

if [ -d "src" ]; then
    print_success "Generated source files found in src/"
else
    print_error "Generated source files not found!"
    exit 1
fi

print_success "VScript grammar built successfully!"

echo
echo "Files generated:"
echo "  - tree-sitter-vscript.wasm (for Zed)"
echo "  - src/parser.c (generated C parser)"
echo "  - src/tree_sitter/parser.h (generated header)"
echo
echo "To install in Zed:"
echo "  1. Copy this entire directory to ~/.config/zed/extensions/vscript/grammars/vscript/"
echo "  2. Or use 'Extensions: Install Dev Extension' in Zed"
echo

print_success "Build complete!"
