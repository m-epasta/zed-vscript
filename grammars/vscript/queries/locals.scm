; Scopes
[
  (source_file)
  (function_declaration)
  (method_declaration)
  (function_expression)
  (class_declaration)
  (block)
  (try_statement)
  (for_statement)
] @local.scope

; Definitions
(function_declaration
  name: (identifier) @local.definition.function)

(method_declaration
  name: (identifier) @local.definition.method)

(class_declaration
  name: (identifier) @local.definition.type)

(variable_declaration
  name: (identifier) @local.definition.variable)

(field_declaration
  name: (identifier) @local.definition.field)

(parameter
  name: (identifier) @local.definition.parameter)

; References
(identifier) @local.reference

; Imports
(import_statement
  alias: (identifier) @local.definition.import)

; Exports
(export_statement) @local.definition.export
