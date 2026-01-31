(ERROR) @error

(comment) @comment

; Literals
(number_literal) @number
(string_literal) @string
(interpolated_string) @string
(boolean_literal) @boolean
(nil_literal) @constant.builtin

; Keywords
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
 "go"
 "if"
 "import"
 "in"
 "interface"
 "is"
 "lock"
 "match"
 "pub"
 "return"
 "struct"
 "class"
 "let"
 "try"
 "catch"
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

 "~"
 "&"
 "|"
 "^"

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
