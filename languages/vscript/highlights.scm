(ERROR) @error

(comment) @comment

; Literals
(number_literal) @number
(string_literal) @string
(interpolated_string) @string
(nil_literal) @constant.builtin
(this_expression) @variable.builtin

; Booleans
"true" @boolean
"false" @boolean

; Declarations
(class_declaration name: (identifier) @type)
(struct_declaration name: (identifier) @type)
(enum_declaration name: (identifier) @type)
(function_declaration name: (identifier) @function)
(method name: (identifier) @method)

; Calls
(call_expression
  function: (variable_expression (identifier) @function))
(call_expression
  function: (member_expression
    property: (identifier) @method))

; Properties
(member_expression
  property: (identifier) @property)

; Imports
(module_declaration (identifier) @variable.other)
(import_statement (identifier) @variable.other)

; Keywords
[
 "as"
 "async"
 "await"
 "catch"
 "class"
 "else"
 "enum"
 "fn"
 "for"
 "if"
 "import"
 "let"
 "match"
 "module"
 "return"
 "struct"
 "try"
 "while"
] @keyword

; Punctuation
[
    "."
    ","
    ":"
    ";"
] @punctuation.delimiter

[
 "("
 ")"
 "{"
 "}"
 "["
 "]"
] @punctuation.bracket

; Operators
[
 "++"
 "--"
 "+"
 "-"
 "*"
 "/"
 "%"
 "!"
 "&&"
 "||"
 "!="
 "<"
 ">"
 "<="
 ">="
 "+="
 "-="
 "*="
 "/="
 "|="
 "="
 "=="
 "=>"
] @operator
