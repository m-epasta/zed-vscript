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
