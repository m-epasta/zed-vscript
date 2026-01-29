module.exports = grammar({
  name: "vscript",

  extras: ($) => [/\s/, $.comment],

  rules: {
    source_file: ($) => repeat($._item),

    _item: ($) =>
      choice(
        $.function_declaration,
        $.class_declaration,
        $.variable_declaration,
        $.import_statement,
        $.expression_statement,
        $.if_statement,
        $.while_statement,
        $.for_statement,
        $.return_statement,
        $.block,
      ),

    // Comments
    comment: ($) =>
      choice(seq("//", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),

    // Identifiers
    identifier: ($) => /[a-zA-Z_][a-zA-Z0-9_]*/,

    // Literals
    string_literal: ($) =>
      choice(
        seq('"', repeat(choice($.template_chars, $.string_interpolation)), '"'),
        seq("'", repeat(choice(/[^'\\]/, /\\./)), "'"),
      ),

    template_chars: ($) => /[^"\\$]+|\\.|\$[^{]/,

    string_interpolation: ($) => seq("${", $._expression, "}"),

    number_literal: ($) => /\d+(\.\d+)?/,

    boolean_literal: ($) => choice("true", "false"),

    nil_literal: ($) => "nil",

    // Function Declaration
    function_declaration: ($) =>
      seq(
        repeat($.decorator),
        optional("async"),
        "fn",
        field("name", $.identifier),
        "(",
        optional($.parameter_list),
        ")",
        field("body", $.block),
      ),

    parameter_list: ($) =>
      seq($.parameter, repeat(seq(",", $.parameter)), optional(",")),

    parameter: ($) =>
      seq(
        field("name", $.identifier),
        optional(seq("=", field("default", $._expression))),
      ),

    // Class Declaration
    class_declaration: ($) =>
      seq(
        repeat($.decorator),
        "class",
        field("name", $.identifier),
        optional(seq("<", field("superclass", $.identifier))),
        "{",
        repeat(choice($.method_declaration, $.field_declaration)),
        "}",
      ),

    method_declaration: ($) =>
      seq(
        repeat($.decorator),
        optional("async"),
        "fn",
        field("name", $.identifier),
        "(",
        optional($.parameter_list),
        ")",
        field("body", $.block),
      ),

    field_declaration: ($) =>
      seq(
        "let",
        field("name", $.identifier),
        optional(seq("=", field("value", $._expression))),
        optional(";"),
      ),

    // Variable Declaration
    variable_declaration: ($) =>
      seq(
        "let",
        field("name", $.identifier),
        optional(seq("=", field("value", $._expression))),
        optional(";"),
      ),

    // Import Statement
    import_statement: ($) =>
      seq(
        "import",
        choice(
          field("path", $.string_literal),
          seq(
            field("module", $.identifier),
            ":",
            field("item", $.identifier),
            "as",
            field("alias", $.identifier),
          ),
          seq(
            field("path", $.string_literal),
            "as",
            field("alias", $.identifier),
          ),
        ),
        optional(";"),
      ),

    // Decorators
    decorator: ($) =>
      seq(
        "@[",
        field("name", $.identifier),
        optional(seq("(", optional($.argument_list), ")")),
        "]",
      ),

    // Statements
    expression_statement: ($) => seq($._expression, optional(";")),

    if_statement: ($) =>
      seq(
        "if",
        field("condition", $._expression),
        field("then", $.block),
        optional(seq("else", field("else", choice($.block, $.if_statement)))),
      ),

    while_statement: ($) =>
      seq("while", field("condition", $._expression), field("body", $.block)),

    for_statement: ($) =>
      seq(
        "for",
        field("init", choice($.variable_declaration, $.expression_statement)),
        field("condition", $._expression),
        ";",
        field("update", $._expression),
        field("body", $.block),
      ),

    return_statement: ($) =>
      prec.right(seq("return", optional($._expression), optional(";"))),

    block: ($) => prec(1, seq("{", repeat($._item), "}")),

    // Expressions
    _expression: ($) =>
      choice(
        $.assignment_expression,
        $.logical_or_expression,
        $.logical_and_expression,
        $.equality_expression,
        $.relational_expression,
        $.additive_expression,
        $.multiplicative_expression,
        $.unary_expression,
        $.call_expression,
        $.member_expression,
        $.index_expression,
        $.await_expression,
        $.primary_expression,
      ),

    assignment_expression: ($) =>
      prec.right(
        1,
        seq(
          field(
            "left",
            choice($.identifier, $.member_expression, $.index_expression),
          ),
          "=",
          field("right", $._expression),
        ),
      ),

    logical_or_expression: ($) =>
      prec.left(
        2,
        seq(
          field("left", $._expression),
          choice("or", "||"),
          field("right", $._expression),
        ),
      ),

    logical_and_expression: ($) =>
      prec.left(
        3,
        seq(
          field("left", $._expression),
          choice("and", "&&"),
          field("right", $._expression),
        ),
      ),

    equality_expression: ($) =>
      prec.left(
        4,
        seq(
          field("left", $._expression),
          choice("==", "!="),
          field("right", $._expression),
        ),
      ),

    relational_expression: ($) =>
      prec.left(
        5,
        seq(
          field("left", $._expression),
          choice("<", "<=", ">", ">="),
          field("right", $._expression),
        ),
      ),

    additive_expression: ($) =>
      prec.left(
        6,
        seq(
          field("left", $._expression),
          choice("+", "-"),
          field("right", $._expression),
        ),
      ),

    multiplicative_expression: ($) =>
      prec.left(
        7,
        seq(
          field("left", $._expression),
          choice("*", "/", "%"),
          field("right", $._expression),
        ),
      ),

    unary_expression: ($) =>
      prec(
        8,
        seq(choice("!", "-", "++", "--"), field("operand", $._expression)),
      ),

    call_expression: ($) =>
      prec.left(
        10,
        seq(
          field("function", $._expression),
          "(",
          optional($.argument_list),
          ")",
        ),
      ),

    member_expression: ($) =>
      prec.left(
        11,
        seq(
          field("object", $._expression),
          ".",
          field("property", $.identifier),
        ),
      ),

    index_expression: ($) =>
      prec.left(
        12,
        seq(
          field("object", $._expression),
          "[",
          field("index", $._expression),
          "]",
        ),
      ),

    await_expression: ($) =>
      prec(13, seq("await", field("argument", $._expression))),

    primary_expression: ($) =>
      choice(
        $.identifier,
        $.string_literal,
        $.number_literal,
        $.boolean_literal,
        $.nil_literal,
        $.array_literal,
        $.object_literal,
        $.this_expression,
        $.parenthesized_expression,
      ),

    array_literal: ($) =>
      seq(
        "[",
        optional(
          seq($._expression, repeat(seq(",", $._expression)), optional(",")),
        ),
        "]",
      ),

    object_literal: ($) =>
      prec(
        2,
        seq(
          "{",
          optional(
            seq(
              $.object_property,
              repeat(seq(",", $.object_property)),
              optional(","),
            ),
          ),
          "}",
        ),
      ),

    object_property: ($) =>
      seq(
        field("key", choice($.identifier, $.string_literal)),
        ":",
        field("value", $._expression),
      ),

    this_expression: ($) => "this",

    parenthesized_expression: ($) => seq("(", $._expression, ")"),

    argument_list: ($) =>
      seq($._expression, repeat(seq(",", $._expression)), optional(",")),
  },
});
