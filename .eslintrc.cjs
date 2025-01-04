module.exports = {
	root: true,
	env: {
		node: true,
	},
	globals: {
		NodeJS: true,
	},
	parser: 'vue-eslint-parser',
	parserOptions: {
		parser: '@typescript-eslint/parser',
		ecmaVersion: 2020,
		sourceType: 'module',
	},
	extends: [
		'eslint:recommended',
		'plugin:vue/vue3-recommended',
		'plugin:@typescript-eslint/recommended',
	],
	plugins: ['@typescript-eslint'],
	ignorePatterns: ['dist'],
	rules: {
		'vue/html-indent': ['error', 'tab', {
			'attribute': 1,
			'baseIndent': 1,
			'closeBracket': 0,
			'alignAttributesVertically': true,
			'ignores': []
		}],
		"vue/max-attributes-per-line": ["error", {
			"singleline": {
				"max": 1
			},
			"multiline": {
				"max": 1
			}
		}],
		'object-curly-spacing': ['error', 'always'],
		'quotes': ['error', 'single'],
		'no-trailing-spaces': 'error',
		'no-multiple-empty-lines': ['error', { max: 1, maxEOF: 1 }],
		'semi': ['error', 'never'],
		'@typescript-eslint/indent': ['warn', 'tab'],
	}
}
