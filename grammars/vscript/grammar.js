/* eslint-disable arrow-parens */
/* eslint-disable camelcase */
/* eslint-disable-next-line spaced-comment */

const PREC = {
	attributes: 10,
	match_arm_type: 9,
	type_initializer: 8,
	primary: 7,
	unary: 6,
	multiplicative: 5,
	additive: 4,
	comparative: 3,
	and: 2,
	or: 1,
	resolve: 1,
	composite_literal: -1,
	strictly_expression_list: -2,
};

const factors_operators = ["*", "/"];
const terms_operators = ["+", "-", "|", "^"];
const comparative_operators = ["==", "!=", "<", "<=", ">", ">="];
const assignment_operators = factors_operators
	.concat(terms_operators)
	.map((operator) => operator + "=")
	.concat("=");
const unary_operators = ["+", "-"];

const terminator = [";", "\n", "\r", "\r\n"];
const digit = /[0-9]/;
const unicode_letter = /[a-zA-Zα-ωΑ-Ωµ]/;
const letter = choice(unicode_letter, "_");

const hex_digit = /[0-9a-fA-F]/;
const oct_digit = /[0-7]/;
const decimal_digit = /[0-9]/;
const binary_digit = /[01]/;

const hex_digits = seq(hex_digit, repeat(seq(optional("_"), hex_digit)));
const oct_digits = seq(oct_digit, repeat(seq(optional("_"), oct_digit)));
const decimal_digits = seq(decimal_digit, repeat(seq(optional("_"), decimal_digit)));
const binary_digits = seq(binary_digit, repeat(seq(optional("_"), binary_digit)));

const hex_literal = seq("0", choice("x", "X"), optional("_"), hex_digits);
const oct_literal = seq("0", choice("o", "O"), optional(seq("_", oct_digits)));
const decimal_literal = choice("0", seq(/[1-9]/, optional(seq(optional("_"), decimal_digits))));
const binary_literal = seq("0", choice("b", "B"), optional(seq("_", binary_digits)));

module.exports = grammar({
	name: "vscript",

	extras: ($) => [$.comment, /\s/],

	inline: ($) => [$._expression, $._statement],

conflicts: ($) => [
  [$.call_expression, $.binary_expression],
  [$.call_expression, $.member_expression],
  [$.call_expression, $.index_expression],
  [$.array_expression, $.array_expression],
  [$.map_expression, $.map_expression],
  [$.block, $.map_expression],
  [$.string_literal, $.interpolated_string],
  [$.identifier_pattern, $.variant_pattern],
  [$.primary_expression, $.match_arm],
  [$.call_expression],
],

	rules: {
		source_file: ($) => seq(optional(seq($.module_declaration, $._terminator)), repeat($._statement), optional($._terminator)),

		module_declaration: ($) => seq("module", $._identifier),

		_statement: ($) =>
			choice(
				$.class_declaration,
				$.struct_declaration,
				$.enum_declaration,
				$.function_declaration,
				$.var_declaration,
				$.import_statement,
				$.expression_statement,
				$.if_statement,
				$.while_statement,
				$.for_statement,
				$.try_statement,
				$.return_statement,
				$.block,
			),

		class_declaration: ($) =>
			seq(
				"class",
				$._identifier,
				"{",
				repeat(
					seq(
						repeat(
							seq(
								"@[",
								repeat(
									seq(
										$._identifier,
										optional(seq(":", $._expression)),
										optional(seq("(", $._expression, ")")),
										optional(","),
									),
								),
								"]",
							),
						),
						optional($._terminator),
						$.method,
					),
				),
				"}",
			),

		struct_declaration: ($) =>
			seq(
				"struct",
				$._identifier,
				"{",
				repeat(
					seq(
						repeat(
							seq(
								"@[",
								repeat(
									seq(
										$._identifier,
										optional(seq(":", $._expression)),
										optional(seq("(", $._expression, ")")),
										optional(","),
									),
								),
								"]",
							),
						),
						optional($._terminator),
						$.struct_field,
						optional(seq(",", $._terminator)),
					),
				),
				"}",
			),

		enum_declaration: ($) =>
			seq(
				"enum",
				$._identifier,
				"{",
				repeat(
					seq(
						$._identifier,
						optional(seq("(", repeat(seq($._identifier, optional(seq(",", $._terminator)))), ")")),
						optional(seq(",", $._terminator)),
					),
				),
				"}",
			),

		function_declaration: ($) =>
		seq(
			optional("async"),
			"fn",
			$._identifier,
			"(",
			optional(seq($._identifier, repeat(seq(",", $._terminator, $._identifier)))),
			")",
			"{",
			repeat($._statement),
			"}",
		),

		var_declaration: ($) =>
			seq("let", $._identifier, optional(seq("=", $._expression)), $._terminator),

		import_statement: ($) =>
			seq(
				"import",
				choice(
					seq('"', /[^"]+/, '"'),
					seq($._identifier, repeat(seq(":", $._identifier)), optional(seq("as", $._identifier))),
				),
				$._terminator,
			),

		expression_statement: ($) => seq($._expression, $._terminator),

if_statement: ($) =>
  prec.left(seq("if", "(", $._expression, ")", $._statement, optional(seq("else", $._statement)))),

		while_statement: ($) => seq("while", "(", $._expression, ")", $._statement),

		for_statement: ($) =>
			seq(
				"for",
				"(",
				choice(
					seq("let", $._identifier, "=", $._expression, ";", $._expression, ";", $._expression),
					seq($._expression, ";", $._expression, ";", $._expression),
					seq($._expression, ";", $._expression),
					seq(";", $._expression, ";"),
				),
				")",
				$._statement,
			),

		try_statement: ($) =>
			seq(
				"try",
				"{",
				repeat($._statement),
				"}",
				"catch",
				"(",
				$._identifier,
				")",
				"{",
				repeat($._statement),
				"}",
			),

		return_statement: ($) => seq("return", optional($._expression), $._terminator),

		block: ($) => seq("{", repeat($._statement), "}"),

		_expression: ($) =>
			choice(
				$.assignment_expression,
				$.logical_expression,
				$.binary_expression,
				$.unary_expression,
				$.call_expression,
				$.member_expression,
				$.index_expression,
				$.postfix_expression,
				$.primary_expression,
			),

assignment_expression: ($) =>
  prec.right(seq(choice($.variable_expression, $.index_expression, $.member_expression), choice("=", "+=", "-=", "*=", "/=", "%=", "|="), $._expression)),

logical_expression: ($) =>
  prec.left(choice(seq($._expression, choice("||", "&&"), $._expression))),

binary_expression: ($) =>
  choice(
    prec.left(PREC.multiplicative, seq($._expression, choice("*", "/", "%"), $._expression)),
    prec.left(PREC.additive, seq($._expression, choice("+", "-", "|", "^"), $._expression)),
    prec.left(
      PREC.comparative,
      seq($._expression, choice("==", "!=", "<", "<=", ">", ">="), $._expression),
    ),
  ),

		unary_expression: ($) => 
		choice(
			prec(PREC.unary, seq(choice("+", "-", "!"), $._expression)),
			prec(PREC.unary, seq("await", $._expression)),
		),

		call_expression: ($) =>
			seq(
				$._expression,
				"(",
				optional(seq($._expression, repeat(seq(",", $._terminator, $._expression)))),
				")",
			),

		member_expression: ($) => seq($._expression, ".", $._identifier),

		index_expression: ($) => seq($._expression, "[", $._expression, "]"),

		postfix_expression: ($) => seq($._expression, choice("++", "--")),

		primary_expression: ($) =>
			choice(
				$.literal,
				$.variable_expression,
				$.this_expression,
				$.grouping_expression,
				$.array_expression,
				$.map_expression,
				$.function_expression,
				$.match_expression,
				$.interpolated_string,
			),

		literal: ($) => choice($.number_literal, $.string_literal, $.boolean_literal, $.nil_literal),

		number_literal: ($) => 
		choice(
			hex_literal,
			oct_literal,
			binary_literal,
			// Decimal with optional fractional part
			token(seq(decimal_literal, optional(seq(".", decimal_digits)))),
		),

		string_literal: ($) => seq('"', repeat(choice(/[^\\"]+/, seq("\\", /./))), '"'),

		boolean_literal: ($) => choice("true", "false"),

		nil_literal: ($) => "nil",

		variable_expression: ($) => $._identifier,

	this_expression: ($) => "this",

		grouping_expression: ($) => seq("(", $._expression, ")"),

		array_expression: ($) =>
			seq("[", optional(seq($._expression, repeat(seq(",", $._terminator, $._expression)))), "]"),

		map_expression: ($) =>
			seq(
				"{",
				optional(
					seq(
						$._expression,
						":",
						$._expression,
						repeat(seq(",", $._terminator, $._expression, ":", $._expression)),
					),
				),
				"}",
			),

		function_expression: ($) =>
		seq(
			optional("async"),
			"fn",
			"(",
			optional(seq($._identifier, repeat(seq(",", $._terminator, $._identifier)))),
			")",
			"{",
			repeat($._statement),
			"}",
		),

		match_expression: ($) =>
			seq(
				"match",
				$._expression,
				"{",
				repeat(seq($.match_arm, optional(seq(",", $._terminator)))),
				"}",
			),

		match_arm: ($) =>
			seq(
				choice($.literal_pattern, $.identifier_pattern, $.variant_pattern),
				"=>",
				choice($.function_expression, $._expression),
			),

		literal_pattern: ($) =>
			choice($.number_literal, $.string_literal, $.boolean_literal, $.nil_literal),

		identifier_pattern: ($) => $._identifier,

variant_pattern: ($) =>
  seq(
    optional(seq($._identifier, ".")),
    $._identifier,
    optional(seq("(", repeat(seq($._identifier, optional(seq(",", $._terminator)))), ")")),
  ),

		interpolated_string: ($) =>
			seq('"', repeat(choice(/[^\\"$]+/, seq("\\", /./), $.interpolation)), '"'),

		interpolation: ($) => seq("${", $._expression, "}"),

		struct_field: ($) => seq($._identifier, $._identifier, optional(seq("=", $._expression))),

		method: ($) =>
		seq(
			optional("async"),
			"fn",
			$._identifier,
			"(",
			optional(seq($._identifier, repeat(seq(",", $._terminator, $._identifier)))),
			")",
			"{",
			repeat($._statement),
			"}",
		),

		_identifier: ($) => /[a-zA-Zα-ωΑ-Ωµ_][a-zA-Zα-ωΑ-Ωµ_0-9]*/,

		_terminator: ($) => ";",

		comment: ($) => choice(seq("//", /.*/), seq("/*", /[^*]*\*+([^/*][^*]*\*+)*/, "/")),
	},
});
