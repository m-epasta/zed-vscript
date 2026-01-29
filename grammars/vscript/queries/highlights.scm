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
  "import"
  "async"
  "await"
  "and"
  "or"
] @keyword

; Literals
[
  "true"
  "false"
] @boolean

(nil_literal) @constant.builtin

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

; Function calls - highlight all call expressions for now
(call_expression) @function.call

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

; This expression
(this_expression) @variable.builtin
