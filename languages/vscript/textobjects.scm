(function_declaration) @function.outer
(function_declaration body: (block) @function.inner)

(method) @function.outer
(method body: (block) @function.inner)

(class_declaration) @class.outer
(class_declaration body: (_) @class.inner)

(struct_declaration) @struct.outer
(struct_declaration body: (_) @struct.inner)
