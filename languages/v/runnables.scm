; Run functions with test attributes
(
  (
    (function_declaration @_ @run
      (#has-ancestor? @_ (attribute (identifier) @attr (#eq? @attr "test")))
  ) @_
  (#set! tag v-test)
)


; Run the main function
(
  (
    (function_declaration name: (_) @run
      (#eq? @run "main"))
  ) @_
  (#set! tag v-main)
)
