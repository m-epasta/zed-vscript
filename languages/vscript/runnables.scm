; Run functions with test prefix
(
  (function_declaration
    name: (identifier) @run
    (#match? @run "^test_")) @test
  (#set! tag v-test)
)

; Run the main function
(
  (function_declaration
    name: (identifier) @run
    (#eq? @run "main")) @main
  (#set! tag v-main)
)
