import pluginVue from 'eslint-plugin-vue'
import vueTsEslintConfig from '@vue/eslint-config-typescript'
import skipFormatting from '@vue/eslint-config-prettier/skip-formatting'

export default [
    {
        name: 'app/files-to-lint',
        files: ['**/*.{ts,mts,tsx,vue}'],
    },

    {
        name: 'app/files-to-ignore',
        ignores: ['**/dist/**', '**/dist-ssr/**', '**/coverage/**'],
    },

    {
        rules: {
            'accessor-pairs': 'error',
            'arrow-spacing': [
                'error',
                {
                    'before': true,
                    'after': true
                }
            ],
            'array-bracket-spacing': [
                'error',
                'always'
            ],
            'block-spacing': [
                'error',
                'always'
            ],
            'camelcase': [
                'error',
                {
                    'properties': 'never'
                }
            ],
            'comma-dangle': [
                'error',
                'never'
            ],
            'comma-spacing': [
                'error',
                {
                    'before': false,
                    'after': true
                }
            ],
            'comma-style': [
                'error',
                'last'
            ],
            'constructor-super': 'error',
            'curly': [
                'error',
                'multi-line'
            ],
            'dot-location': [
                'error',
                'property'
            ],
            'eqeqeq': [
                'error',
                'allow-null'
            ],
            'generator-star-spacing': [
                'error',
                {
                    'before': true,
                    'after': true
                }
            ],
            'handle-callback-err': [
                'error',
                '^(err|error)$'
            ],
            'keyword-spacing': [
                'error',
                {
                    'before': true,
                    'after': true,
                    'overrides': {}
                }
            ],
            'key-spacing': [
                'error',
                {
                    'beforeColon': false,
                    'afterColon': true
                }
            ],
            'new-cap': [
                'error',
                {
                    'newIsCap': true,
                    'capIsNew': false
                }
            ],
            'new-parens': 'error',
            'no-array-constructor': 'error',
            'no-caller': 'error',
            'no-class-assign': 'error',
            'no-case-declarations': 'error',
            'no-cond-assign': 'error',
            'no-const-assign': 'error',
            'no-control-regex': 'error',
            'no-debugger': 'error',
            'no-delete-var': 'error',
            'no-dupe-args': 'error',
            'no-dupe-class-members': 'error',
            'no-dupe-keys': 'error',
            'no-duplicate-case': 'error',
            'no-empty-character-class': 'error',
            'no-eval': 'error',
            'no-ex-assign': 'error',
            'no-extend-native': 'error',
            'no-extra-bind': 'error',
            'no-extra-boolean-cast': 'error',
            'no-extra-parens': [
                'error',
                'functions'
            ],
            'no-fallthrough': 'error',
            'no-floating-decimal': 'error',
            'no-func-assign': 'error',
            'no-implied-eval': 'error',
            'no-implicit-coercion': 'error',
            'no-inner-declarations': [
                'error',
                'functions'
            ],
            'no-invalid-regexp': 'error',
            'no-invalid-this': 'error',
            'no-irregular-whitespace': 'error',
            'no-iterator': 'error',
            'no-label-var': 'error',
            'no-labels': [
                'error',
                {
                    'allowLoop': false,
                    'allowSwitch': false
                }
            ],
            'no-lone-blocks': 'error',
            'no-mixed-spaces-and-tabs': 'error',
            'no-multi-spaces': 'error',
            'no-multi-str': 'error',
            'no-multiple-empty-lines': [
                'error',
                {
                    'max': 2
                }
            ],
            'no-native-reassign': 'error',
            'no-negated-in-lhs': 'error',
            'no-new': 'error',
            'no-new-func': 'error',
            'no-new-object': 'error',
            'no-new-require': 'error',
            'no-new-wrappers': 'error',
            'no-obj-calls': 'error',
            'no-octal': 'error',
            'no-proto': 'error',
            'no-redeclare': 'error',
            'no-regex-spaces': 'error',
            'no-return-assign': 'error',
            'no-self-compare': 'error',
            'no-sequences': 'error',
            'no-shadow-restricted-names': 'error',
            'no-spaced-func': 'error',
            'no-sparse-arrays': 'error',
            'no-this-before-super': 'error',
            'no-throw-literal': 'error',
            'no-trailing-spaces': 'error',
            'no-undef': 'error',
            'no-undef-init': 'error',
            'no-unexpected-multiline': 'error',
            'no-unneeded-ternary': [
                'error',
                {
                    'defaultAssignment': false
                }
            ],
            'no-unreachable': 'error',
            'no-unused-vars': [
                0,
                {
                    'vars': 'all',
                    'args': 'none'
                }
            ],
            'no-useless-call': 'error',
            'no-with': 'error',
            'one-var': [
                'error',
                {
                    'initialized': 'never'
                }
            ],
            'operator-linebreak': [
                'error',
                'after',
                {
                    'overrides': {
                        '?': 'before',
                        ':': 'before'
                    }
                }
            ],
            'quotes': [
                1,
                'single',
                'avoid-escape'
            ],
            'radix': 'error',
            'semi': [
                'error',
                'always'
            ],
            'semi-spacing': [
                'error',
                {
                    'before': false,
                    'after': true
                }
            ],
            'space-before-blocks': [
                'error',
                'always'
            ],
            'space-before-function-paren': [
                'error',
                'never'
            ],
            'space-in-parens': [
                'error',
                'never'
            ],
            'space-infix-ops': 'error',
            'space-unary-ops': [
                'error',
                {
                    'words': true,
                    'nonwords': false
                }
            ],
            'spaced-comment': [
                'error',
                'always',
                {
                    'markers': [
                        'global',
                        'globals',
                        'eslint',
                        'eslint-disable',
                        '*package',
                        '!',
                        ','
                    ]
                }
            ],
            'use-isnan': 'error',
            'valid-typeof': 'error',
            'wrap-iife': [
                'error',
                'any'
            ],
            'yoda': [
                'error',
                'never'
            ],
            'require-yield': 0,
        }
    },

    ...pluginVue.configs['flat/essential'],
    ...vueTsEslintConfig(),
    skipFormatting,
]
