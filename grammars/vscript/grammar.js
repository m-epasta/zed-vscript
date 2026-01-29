module.exports = grammar({
  name: 'vscript',

  extras: $ => [
    /\s/,
    $.comment,
  ],

  rules: {
    source_file: $ => repeat($._item),

    _item: $ => choice(
      $.function_declaration,
      $.class_declaration,
      $.variable_declaration,
      $.import_statement,
      $.export_statement,
      $._statement,
    ),

    // Comments
    comment: $ => choice(
      seq('//', /.*/),
      seq(
        '/*',
        /[^*]*\*+([^/*][^*]*\*+)*/,
        '/'
      )
    ),

    // Keywords
    _reserved_word: $ => choice(
      'fn',
      'class',
      'let',
      'if',
      'else',
      'while',
      'for',
      'return',
      'this',
      'super',
      'import',
      'export',
      'async',
      'await',
      'try',
      'catch',
      'match',
      'struct',
      'enum',
      'and',
      'or',
      'true',
      'false',
      'nil'
    ),

    // Identifiers
    identifier: $ => /[a-zA-Z_][a-zA-Z0-9_]*/,

    // Literals
    string_literal: $ => choice(
      seq('"', repeat(choice(/[^"\\]/, /\\./)), '"'),
      seq("'", repeat(choice(/[^'\\]/, /\\./)), "'")
    ),

    interpolated_string: $ => seq(
      '"',
      repeat(choice(
        /[^"$\\]+/,
        /\\./,
        $.string_interpolation
      )),
      '"'
    ),

    string_interpolation: $ => seq(
      '${',
      $._expression,
      '}'
    ),

    number_literal: $ => /\d+(\.\d+)?/,

    boolean_literal: $ => choice('true', 'false'),

    nil_literal: $ => 'nil',

    // Function Declaration
    function_declaration: $ => seq(
      repeat($.decorator),
      optional('async'),
      'fn',
      field('name', $.identifier),
      '(',
      optional($.parameter_list),
      ')',
      field('body', $.block)
    ),

    parameter_list: $ => seq(
      $.parameter,
      repeat(seq(',', $.parameter)),
      optional(',')
    ),

    parameter: $ => seq(
      field('name', $.identifier),
      optional(seq('=', field('default', $._expression)))
    ),

    // Class Declaration
    class_declaration: $ => seq(
      repeat($.decorator),
      'class',
      field('name', $.identifier),
      optional(seq('<', field('superclass', $.identifier))),
      '{',
      repeat(choice(
        $.method_declaration,
        $.field_declaration
      )),
      '}'
    ),

    method_declaration: $ => seq(
      repeat($.decorator),
      optional('async'),
      'fn',
      field('name', $.identifier),
      '(',
      optional($.parameter_list),
      ')',
      field('body', $.block)
    ),

    field_declaration: $ => seq(
      'let',
      field('name', $.identifier),
      optional(seq('=', field('value', $._expression))),
      optional(';')
    ),

    // Variable Declaration
    variable_declaration: $ => seq(
      'let',
      field('name', $.identifier),
      optional(seq('=', field('value', $._expression))),
      optional(';')
    ),

    // Import/Export
    import_statement: $ => seq(
      'import',
      choice(
        seq(field('path', $.string_literal)),
        seq(
          field('path', $.string_literal),
          'as',
          field('alias', $.identifier)
        ),
        seq(
          field('module', $.identifier),
          ':',
          field('item', $.identifier),
          'as',
          field('alias', $.identifier)
        )
      ),
      optional(';')
    ),

    export_statement: $ => seq(
      'export',
      $._item
    ),

    // Decorators
    decorator: $ => seq(
      '@[',
      field('name', $.identifier),
      optional(seq(
        '(',
        optional($.argument_list),
        ')'
      )),
      ']'
    ),

    // Statements
    _statement: $ => choice(
      $.expression_statement,
      $.variable_declaration,
      $.if_statement,
      $.while_statement,
      $.for_statement,
      $.return_statement,
      $.break_statement,
      $.continue_statement,
      $.try_statement,
      $.block
    ),

    expression_statement: $ => seq($._expression, optional(';')),

    if_statement: $ => seq(
      'if',
      field('condition', $._expression),
      field('then', $._statement),
      optional(seq('else', field('else', $._statement)))
    ),

    while_statement: $ => seq(
      'while',
      field('condition', $._expression),
      field('body', $._statement)
    ),

    for_statement: $ => seq(
      'for',
      optional(field('init', $._statement)),
      ';',
      optional(field('condition', $._expression)),
      ';',
      optional(field('update', $._expression)),
      field('body', $._statement)
    ),

    return_statement: $ => seq(
      'return',
      optional($._expression),
      optional(';')
    ),

    break_statement: $ => seq('break', optional(';')),

    continue_statement: $ => seq('continue', optional(';')),

    try_statement: $ => seq(
      'try',
      field('body', $.block),
      optional(seq(
        'catch',
        optional(seq('(', field('parameter', $.identifier), ')')),
        field('handler', $.block)
      ))
    ),

    block: $ => seq('{', repeat($._statement), '}'),

    // Expressions
    _expression: $ => choice(
      $.assignment_expression,
      $.logical_or_expression
    ),

    assignment_expression: $ => prec.right(1, seq(
      field('left', choice($.identifier, $.member_expression, $.index_expression)),
      '=',
      field('right', $._expression)
    )),

    logical_or_expression: $ => prec.left(2, seq(
      field('left', $._expression),
      choice('or', '||'),
      field('right', $._expression)
    )),

    logical_and_expression: $ => prec.left(3, seq(
      field('left', $._expression),
      choice('and', '&&'),
      field('right', $._expression)
    )),

    equality_expression: $ => prec.left(4, seq(
      field('left', $._expression),
      choice('==', '!='),
      field('right', $._expression)
    )),

    relational_expression: $ => prec.left(5, seq(
      field('left', $._expression),
      choice('<', '<=', '>', '>='),
      field('right', $._expression)
    )),

    additive_expression: $ => prec.left(6, seq(
      field('left', $._expression),
      choice('+', '-'),
      field('right', $._expression)
    )),

    multiplicative_expression: $ => prec.left(7, seq(
      field('left', $._expression),
      choice('*', '/', '%'),
      field('right', $._expression)
    )),

    unary_expression: $ => prec(8, seq(
      choice('!', '-', '++', '--'),
      field('operand', $._expression)
    )),

    postfix_expression: $ => prec(9, seq(
      field('operand', $._expression),
      choice('++', '--')
    )),

    call_expression: $ => prec.left(10, seq(
      field('function', $._expression),
      '(',
      optional($.argument_list),
      ')'
    )),

    member_expression: $ => prec.left(11, seq(
      field('object', $._expression),
      '.',
      field('property', $.identifier)
    )),

    index_expression: $ => prec.left(12, seq(
      field('object', $._expression),
      '[',
      field('index', $._expression),
      ']'
    )),

    await_expression: $ => prec(13, seq(
      'await',
      field('argument', $._expression)
    )),

    primary_expression: $ => choice(
      $.identifier,
      $.string_literal,
      $.interpolated_string,
      $.number_literal,
      $.boolean_literal,
      $.nil_literal,
      $.array_literal,
      $.object_literal,
      $.function_expression,
      $.this_expression,
      $.super_expression,
      $.parenthesized_expression
    ),

    array_literal: $ => seq(
      '[',
      optional(seq(
        $._expression,
        repeat(seq(',', $._expression)),
        optional(',')
      )),
      ']'
    ),

    object_literal: $ => seq(
      '{',
      optional(seq(
        $.object_property,
        repeat(seq(',', $.object_property)),
        optional(',')
      )),
      '}'
    ),

    object_property: $ => seq(
      field('key', choice($.identifier, $.string_literal)),
      ':',
      field('value', $._expression)
    ),

    function_expression: $ => seq(
      optional('async'),
      'fn',
      '(',
      optional($.parameter_list),
      ')',
      field('body', $.block)
    ),

    this_expression: $ => 'this',

    super_expression: $ => 'super',

    parenthesized_expression: $ => seq('(', $._expression, ')'),

    argument_list: $ => seq(
      $._expression,
      repeat(seq(',', $._expression)),
      optional(',')
    ),
  },

  precedences: $ => [
    [
      'assignment',
      'logical_or',
      'logical_and',
      'equality',
      'relational',
      'additive',
      'multiplicative',
      'unary',
      'postfix',
      'call',
      'member',
      'index',
      'await',
      'primary'
    ]
  ]
});
