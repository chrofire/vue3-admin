module.exports = {
    processors: [],
    extends: [
        'stylelint-config-standard-scss',
        'stylelint-config-recommended-vue'
    ],
    rules: {
        indentation: 4,
        'rule-empty-line-before': [
            'always',
            {
                except: [
                    'after-rule',
                    'after-single-line-comment',
                    'inside-block-and-after-rule',
                    'inside-block',
                    'first-nested'
                ]
            }
        ],
        'no-empty-source': null,
        'block-no-empty': null,
        'selector-pseudo-class-no-unknown': null,
        'selector-pseudo-element-no-unknown': null,
        'no-duplicate-selectors': null,
        'no-descending-specificity': null,
        'selector-class-pattern': null,
        'scss/at-import-partial-extension': null,
        'alpha-value-notation': null,
        'color-function-notation': null,
    }
}
