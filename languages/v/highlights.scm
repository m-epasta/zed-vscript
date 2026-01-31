[
    (comment)
] @comment

(identifier) @variable
(import_path) @variable

(parameter_declaration
  name: (identifier) @parameter)
(function_declaration
  name: (identifier) @function)
(function_declaration
  receiver: (receiver)
  name: (identifier) @method)

(short_lambda
  (reference_expression) @parameter)

(field_name) @property


(int_literal) @number
(interpreted_string_literal) @string
(escape_sequence) @string.escape

[
 "as"
 "assert"
 "break"
 "const"
 "continue"
 "else"
 "enum"
 "fn"
 "for"
 "$for"
 "go"
 "if"
 "$if"
 "import"
 "in"
 "!in"
 "interface"
 "is"
 "!is"
 "lock"
 "match"
 "pub"
 "return"
 "struct"
] @keyword

[
    (true) @boolean
    (false) @boolean
]

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

[
 "++"
 "--"

 "+"
 "-"
 "*"
 "/"
 "%"

 "~"
 "&"
 "|"
 "^"

 "!"
 "&&"
 "||"
 "!="

 "<<"
 ">>"

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
 ":="
 "=="

 "?"
 "$"
 ".."
] @operator