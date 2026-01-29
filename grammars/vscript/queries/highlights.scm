; Keywords
[
  "fn"
  "class"
  "let"
  "if"
  "else"
  "while"
  "for"
  "return"
  "this"
  "super"
  "import"
  "export"
  "async"
  "await"
  "try"
  "catch"
  "match"
  "struct"
  "enum"
  "and"
  "or"
] @keyword

; Literals
[
  "true"
  "false"
] @boolean

"nil" @constant.builtin

(number_literal) @number
(string_literal) @string
(template_chars) @string

; String interpolation
(string_interpolation
  "${" @punctuation.special
  "}" @punctuation.special)

; Comments
(comment) @comment

; Functions
(function_declaration
  name: (identifier) @function)

(method_declaration
  name: (identifier) @function.method)

(function_expression) @function

(call_expression
  function: (identifier) @function.call)

(call_expression
  function: (member_expression
    property: (identifier) @function.method.call))

; Classes
(class_declaration
  name: (identifier) @type)

(class_declaration
  superclass: (identifier) @type)

; Variables
(variable_declaration
  name: (identifier) @variable)

(field_declaration
  name: (identifier) @property)

(parameter
  name: (identifier) @parameter)

; Identifiers
(identifier) @variable

; Properties
(member_expression
  property: (identifier) @property)

(object_property
  key: (identifier) @property)

; Decorators
(decorator
  "@[" @punctuation.special
  name: (identifier) @attribute
  "]" @punctuation.special)

; Operators
[
  "="
  "=="
  "!="
  "<"
  "<="
  ">"
  ">="
  "+"
  "-"
  "*"
  "/"
  "%"
  "!"
  "++"
  "--"
  "&&"
  "||"
] @operator

; Punctuation
[
  "("
  ")"
  "["
  "]"
  "{"
  "}"
] @punctuation.bracket

[
  ";"
  ","
  "."
  ":"
] @punctuation.delimiter

; Special
"${" @punctuation.special
