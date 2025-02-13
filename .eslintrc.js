// @ts-check

/**
 * @typedef {import('eslint').Linter.Config} Config
 */

const path = require('path');
const a11yBase = require('eslint-config-airbnb/rules/react-a11y');

const controlHasAssociatedLabelConfig = a11yBase.rules['jsx-a11y/control-has-associated-label'];

const controlHasAssociatedLabelOptions =
  typeof controlHasAssociatedLabelConfig[1] === 'object' ? controlHasAssociatedLabelConfig[1] : {};

const OneLevelImportMessage = [
  'Prefer one level nested imports to avoid bundling everything in dev mode or breaking CJS/ESM split.',
  'See https://github.com/mui/material-ui/pull/24147 for the kind of win it can unlock.',
].join('\n');
// This only applies to packages published from this monorepo.
// If you build a library around `@mui/material` you can safely use `createStyles` without running into the same issue as we are.
const forbidCreateStylesMessage =
  'Use `MuiStyles<ClassKey, Props>` instead if the styles are exported. Otherwise use `as const` assertions. ' +
  '`createStyles` will lead to inlined, at-compile-time-resolved type-imports. ' +
  'See https://github.com/microsoft/TypeScript/issues/36097#issuecomment-578324386 for more information';

const ENABLE_REACT_COMPILER_PLUGIN = false;

const NO_RESTRICTED_IMPORTS_PATHS_TOP_LEVEL_PACKAGES = [
  {
    name: '@mui/material',
    message: OneLevelImportMessage,
  },
  {
    name: '@mui/lab',
    message: OneLevelImportMessage,
  },
];

const NO_RESTRICTED_IMPORTS_PATTERNS_DEEPLY_NESTED = [
  {
    group: [
      '@mui/*/*/*',
      '@pigment-css/*/*/*',
      '@base-ui/*/*/*',
      // Allow any import depth with any internal packages
      '!@mui/internal-*/**',
      // TODO delete
      '@base-ui-components/*/*/*', // Wait for migration to @base-ui/
      '@base_ui/*/*/*', // Legacy, moved to @base-ui-components/
      '!@mui/docs/**', // @mui/docs should be @mui/internal-docs
    ],
    message: OneLevelImportMessage,
  },
];

module.exports = /** @type {Config} */ ({
  root: true, // So parent files don't get applied
  env: {
    es2020: true,
    browser: true,
    node: true,
  },
  extends: [
    'plugin:eslint-plugin-import/recommended',
    'plugin:eslint-plugin-import/typescript',
    'eslint-config-airbnb',
    './eslint/config-airbnb-typescript.js',
    'eslint-config-prettier',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 7,
  },
  plugins: [
    'eslint-plugin-material-ui',
    'eslint-plugin-react-hooks',
    '@typescript-eslint',
    'eslint-plugin-filenames',
    ...(ENABLE_REACT_COMPILER_PLUGIN ? ['eslint-plugin-react-compiler'] : []),
  ],
  settings: {
    'import/resolver': {
      webpack: {
        config: path.join(__dirname, './webpackBaseConfig.js'),
      },
    },
  },
  /**
   * Sorted alphanumerically within each group. built-in and each plugin form
   * their own groups.
   */
  rules: {
    'consistent-this': ['error', 'self'],
    curly: ['error', 'all'],
    'dot-notation': 'error',
    // Just as bad as "max components per file"
    'max-classes-per-file': 'off',
    // Too interruptive
    'no-alert': 'error',
    // Stylistic opinion
    'arrow-body-style': 'off',
    // Allow warn and error for dev environments
    'no-console': ['error', { allow: ['warn', 'error'] }],
    'no-param-reassign': 'off', // It's fine.
    // Airbnb use warn https://github.com/airbnb/javascript/blob/63098cbb6c05376dbefc9a91351f5727540c1ce1/packages/eslint-config-airbnb-base/rules/style.js#L97
    // but eslint recommands error
    'func-names': 'error',
    'no-restricted-imports': [
      'error',
      {
        patterns: NO_RESTRICTED_IMPORTS_PATTERNS_DEEPLY_NESTED,
      },
    ],
    'no-continue': 'off',
    'no-constant-condition': 'error',
    'no-implied-eval': 'error',
    'no-throw-literal': 'error',
    // Use the proptype inheritance chain
    'no-prototype-builtins': 'off',
    'no-return-await': 'error',
    'no-underscore-dangle': 'error',
    'nonblock-statement-body-position': 'error',
    'prefer-arrow-callback': ['error', { allowNamedFunctions: true }],
    // Destructuring harm grep potential.
    'prefer-destructuring': 'off',

    'no-use-before-define': 'off',
    '@typescript-eslint/no-use-before-define': [
      'error',
      {
        functions: false,
        classes: true,
        variables: true,
      },
    ],
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        vars: 'all',
        args: 'after-used',
        ignoreRestSiblings: true,
        argsIgnorePattern: '^_',
        caughtErrors: 'none',
      },
    ],

    // Not sure why it doesn't work
    'import/named': 'off',
    'import/no-cycle': 'off',
    // Missing yarn workspace support
    'import/no-extraneous-dependencies': 'off',
    // The code is already coupled to webpack. Prefer explicit coupling.
    'import/no-webpack-loader-syntax': 'off',

    // doesn't work?
    'jsx-a11y/label-has-associated-control': [
      'error',
      {
        // airbnb uses 'both' which requires nesting i.e. <label><input /></label>
        // 'either' allows `htmlFor`
        assert: 'either',
      },
    ],
    // We are a library, we need to support it too
    'jsx-a11y/no-autofocus': 'off',
    // Remove when issues are fixed
    // https://github.com/jsx-eslint/eslint-plugin-jsx-a11y/issues/959
    // https://github.com/airbnb/javascript/issues/3069
    'jsx-a11y/control-has-associated-label': [
      'error',
      {
        ...controlHasAssociatedLabelOptions,
        ignoreElements: [...(controlHasAssociatedLabelOptions.ignoreElements || []), 'th', 'td'],
      },
    ],

    'material-ui/docgen-ignore-before-comment': 'error',
    'material-ui/rules-of-use-theme-variants': 'error',
    'material-ui/no-empty-box': 'error',
    'material-ui/no-styled-box': 'error',
    'material-ui/straight-quotes': 'error',

    'react-hooks/exhaustive-deps': ['error', { additionalHooks: 'useEnhancedEffect' }],
    'react-hooks/rules-of-hooks': 'error',

    'react/default-props-match-prop-types': [
      'error',
      {
        // Otherwise the rule thinks inner props = outer props
        // But in TypeScript we want to know that a certain prop is defined during render
        // while it can be ommitted from the callsite.
        // Then defaultProps (or default values) will make sure that the prop is defined during render
        allowRequiredDefaults: true,
      },
    ],
    // Can add verbosity to small functions making them harder to grok.
    // Though we have to manually enforce it for function components with default values.
    'react/destructuring-assignment': 'off',
    'react/forbid-prop-types': 'off', // Too strict, no time for that
    'react/jsx-curly-brace-presence': 'off', // broken
    // airbnb is using .jsx
    'react/jsx-filename-extension': ['error', { extensions: ['.js', '.tsx'] }],
    // Prefer <React.Fragment> over <>.
    'react/jsx-fragments': ['error', 'element'],
    // Enforces premature optimization
    'react/jsx-no-bind': 'off',
    // We are a UI library.
    'react/jsx-props-no-spreading': 'off',
    // This rule is great for raising people awareness of what a key is and how it works.
    'react/no-array-index-key': 'off',
    'react/no-danger': 'error',
    'react/no-unknown-property': ['error', { ignore: ['sx'] }],
    'react/no-direct-mutation-state': 'error',
    // Not always relevant
    'react/require-default-props': 'off',
    'react/sort-prop-types': 'error',
    // This depends entirely on what you're doing. There's no universal pattern
    'react/state-in-constructor': 'off',
    // stylistic opinion. For conditional assignment we want it outside, otherwise as static
    'react/static-property-placement': 'off',
    // noopener is enough
    // https://github.com/jsx-eslint/eslint-plugin-react/blob/master/docs/rules/jsx-no-target-blank.md#rule-options
    'react/jsx-no-target-blank': ['error', { allowReferrer: true }],

    'no-restricted-syntax': [
      'error',
      {
        message:
          "Do not import default or named exports from React. Use a namespace import (import * as React from 'react';) instead.",
        selector:
          'ImportDeclaration[source.value="react"] ImportDefaultSpecifier, ImportDeclaration[source.value="react"] ImportSpecifier',
      },
      {
        message:
          "Do not import default or named exports from ReactDOM. Use a namespace import (import * as ReactDOM from 'react-dom';) instead.",
        selector:
          'ImportDeclaration[source.value="react-dom"] ImportDefaultSpecifier, ImportDeclaration[source.value="react-dom"] ImportSpecifier',
      },
      {
        message:
          "Do not import default or named exports from ReactDOM. Use a namespace import (import * as ReactDOM from 'react-dom/client';) instead.",
        selector:
          'ImportDeclaration[source.value="react-dom/client"] ImportDefaultSpecifier, ImportDeclaration[source.value="react-dom/client"] ImportSpecifier',
      },
      {
        message:
          "Do not import default or named exports from ReactDOMServer. Use a namespace import (import * as ReactDOM from 'react-dom/server';) instead.",
        selector:
          'ImportDeclaration[source.value="react-dom/server"] ImportDefaultSpecifier, ImportDeclaration[source.value="react-dom/server"] ImportSpecifier',
      },
      {
        message:
          "The 'use client' pragma can't be used with export * in the same module. This is not supported by Next.js.",
        selector: 'ExpressionStatement[expression.value="use client"] ~ ExportAllDeclaration',
      },
      {
        message: 'Do not call `Error(...)` without `new`. Use `new Error(...)` instead.',
        selector: "CallExpression[callee.name='Error']",
      },
    ],

    // We re-export default in many places, remove when https://github.com/airbnb/javascript/issues/2500 gets resolved
    'no-restricted-exports': 'off',
    // Avoid accidental auto-"fixes" https://github.com/jsx-eslint/eslint-plugin-react/issues/3458
    'react/no-invalid-html-attribute': 'off',

    'react/jsx-no-useless-fragment': ['error', { allowExpressions: true }],
    'lines-around-directive': 'off',
    ...(ENABLE_REACT_COMPILER_PLUGIN ? { 'react-compiler/react-compiler': 'error' } : {}),
    // Prevent the use of `e` as a shorthand for `event`, `error`, etc.
    'id-denylist': ['error', 'e'],
  },
  overrides: [
    {
      files: [
        // matching the pattern of the test runner
        '*.test.?(c|m)[jt]s?(x)',
      ],
      extends: ['plugin:mocha/recommended'],
      rules: {
        // does not work with wildcard imports. Mistakes will throw at runtime anyway
        'import/named': 'off',
        'material-ui/disallow-active-element-as-key-event-target': 'error',

        // upgraded level from recommended
        'mocha/no-exclusive-tests': 'error',
        'mocha/no-skipped-tests': 'error',

        // no rationale provided in /recommended
        'mocha/no-mocha-arrows': 'off',
        // definitely a useful rule but too many false positives
        // due to `describeConformance`
        // "If you're using dynamically generated tests, you should disable this rule.""
        'mocha/no-setup-in-describe': 'off',
        // `beforeEach` for a single case is optimized for change
        // when we add a test we don't have to refactor the existing
        // test to `beforeEach`.
        // `beforeEach`+`afterEach` also means that the `beforeEach`
        // is cleaned up in `afterEach` if the test causes a crash
        'mocha/no-hooks-for-single-case': 'off',

        // disable eslint-plugin-jsx-a11y
        // tests are not driven by assistive technology
        // add `jsx-a11y` rules once you encounter them in tests
        'jsx-a11y/click-events-have-key-events': 'off',
        'jsx-a11y/control-has-associated-label': 'off',
        'jsx-a11y/iframe-has-title': 'off',
        'jsx-a11y/label-has-associated-control': 'off',
        'jsx-a11y/mouse-events-have-key-events': 'off',
        'jsx-a11y/no-noninteractive-tabindex': 'off',
        'jsx-a11y/no-static-element-interactions': 'off',
        'jsx-a11y/tabindex-no-positive': 'off',

        // In tests this is generally intended.
        'react/button-has-type': 'off',
        // They are accessed to test custom validator implementation with PropTypes.checkPropTypes
        'react/forbid-foreign-prop-types': 'off',
        // components that are defined in test are isolated enough
        // that they don't need type-checking
        'react/prop-types': 'off',
        'react/no-unused-prop-types': 'off',
      },
    },
    // Next.js plugin
    {
      files: ['docs/**/*'],
      extends: ['plugin:@next/next/recommended'],
      settings: {
        next: {
          rootDir: 'docs',
        },
      },
      rules: {
        // We're not using the Image component at the moment
        '@next/next/no-img-element': 'off',
        'no-restricted-imports': [
          'error',
          {
            paths: NO_RESTRICTED_IMPORTS_PATHS_TOP_LEVEL_PACKAGES,
            patterns: NO_RESTRICTED_IMPORTS_PATTERNS_DEEPLY_NESTED,
          },
        ],
        'no-irregular-whitespace': ['error', { skipJSXText: true, skipStrings: true }],
      },
    },
    {
      files: ['docs/src/modules/components/**/*'],
      rules: {
        'material-ui/no-hardcoded-labels': [
          'error',
          { allow: ['MUI', 'X', 'GitHub', 'Stack Overflow'] },
        ],
      },
    },
    // demos
    {
      files: ['docs/src/pages/**/*', 'docs/data/**/*'],
      rules: {
        // This most often reports data that is defined after the component definition.
        // This is safe to do and helps readability of the demo code since the data is mostly irrelevant.
        '@typescript-eslint/no-use-before-define': 'off',
        'react/prop-types': 'off',
        'no-alert': 'off',
        'no-console': 'off',
      },
    },
    // Next.js entry points pages
    {
      files: ['docs/pages/**/*'],
      rules: {
        'react/prop-types': 'off',
      },
    },
    {
      files: ['docs/data/**/*'],
      excludedFiles: [
        // filenames/match-exported sees filename as 'file-name.d'
        // Plugin looks unmaintain, find alternative? (e.g. eslint-plugin-project-structure)
        '*.d.ts',
        'docs/data/joy/getting-started/templates/**/*',
        'docs/data/**/{css,system,tailwind}/*',
      ],
      rules: {
        'filenames/match-exported': ['error'],
      },
    },
    {
      files: ['docs/data/material/getting-started/templates/**/*'],
      rules: {
        // So we can use # to improve the page UX
        // and so developer get eslint warning to remind them to fix the links
        'jsx-a11y/anchor-is-valid': 'off',
      },
    },
    {
      files: ['*.d.ts'],
      rules: {
        'import/export': 'off', // Not sure why it doesn't work
      },
    },
    {
      files: ['packages/*/src/**/*.tsx'],
      excludedFiles: '*.spec.tsx',
      rules: {
        'react/prop-types': 'off',
      },
    },
    {
      files: ['packages/*/src/*/*.?(c|m)[jt]s?(x)'],
      excludedFiles: [
        '*.spec.*',
        '*.test.*',
        // deprecated library
        '**/mui-base/**/*',
        '**/mui-joy/**/*',
        // used internally, not used on app router yet
        '**/mui-docs/**/*',
      ],
      rules: {
        'material-ui/disallow-react-api-in-server-components': 'error',
      },
    },
    {
      files: ['packages/*/src/**/*.?(c|m)[jt]s?(x)'],
      excludedFiles: '*.spec.*',
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: [
              {
                name: '@mui/material/styles',
                importNames: ['createStyles'],
                message: forbidCreateStylesMessage,
              },
              {
                name: '@mui/styles',
                importNames: ['createStyles'],
                message: forbidCreateStylesMessage,
              },
              {
                name: '@mui/styles/createStyles',
                message: forbidCreateStylesMessage,
              },
            ],
            patterns: [
              // Allow deeper imports for TypeScript types. TODO?
              '@mui/*/*/*/*',
            ],
          },
        ],
      },
    },
    {
      files: ['*.spec.*'],
      rules: {
        'no-alert': 'off',
        'no-console': 'off',
        'no-empty-pattern': 'off',
        'no-lone-blocks': 'off',
        'no-shadow': 'off',

        '@typescript-eslint/no-unused-expressions': 'off',
        '@typescript-eslint/no-unused-vars': 'off',
        '@typescript-eslint/no-use-before-define': 'off',

        // Not sure why it doesn't work
        'import/export': 'off',
        'import/prefer-default-export': 'off',

        'jsx-a11y/anchor-has-content': 'off',
        'jsx-a11y/anchor-is-valid': 'off',
        'jsx-a11y/tabindex-no-positive': 'off',

        'react/default-props-match-prop-types': 'off',
        'react/no-access-state-in-setstate': 'off',
        'react/no-unused-prop-types': 'off',
        'react/prefer-stateless-function': 'off',
        'react/prop-types': 'off',
        'react/require-default-props': 'off',
        'react/state-in-constructor': 'off',
        'react/static-property-placement': 'off',
        'react/function-component-definition': 'off',
      },
    },
    {
      files: ['packages-internal/scripts/typescript-to-proptypes/src/**/*.ts'],
      rules: {
        // Working with flags is common in TypeScript compiler
        'no-bitwise': 'off',
      },
    },
    {
      files: ['packages/*/src/**/*.?(c|m)[jt]s?(x)'],
      excludedFiles: ['*.d.ts', '*.spec.*'],
      rules: {
        'no-restricted-imports': [
          'error',
          {
            paths: NO_RESTRICTED_IMPORTS_PATHS_TOP_LEVEL_PACKAGES,
          },
        ],
        // TODO: Consider setting back to `ignoreExternal: true` when the expected behavior is fixed:
        // https://github.com/import-js/eslint-plugin-import/issues/2348#issuecomment-1587320057
        // Reevaluate when https://github.com/import-js/eslint-plugin-import/pull/2998 is released.
        'import/no-cycle': ['error', { ignoreExternal: false }],
      },
    },
    {
      files: ['packages/*/src/**/*.?(c|m)[jt]s?(x)'],
      excludedFiles: ['*.d.ts', '*.spec.*', 'packages/mui-joy/**/*'],
      rules: {
        'material-ui/mui-name-matches-component-name': 'error',
      },
    },
    {
      files: ['test/bundling/scripts/**/*.js'],
      rules: {
        // ES modules need extensions
        'import/extensions': ['error', 'ignorePackages'],
      },
    },
    {
      files: ['**/*.mjs'],
      rules: {
        'import/extensions': ['error', 'ignorePackages'],
      },
    },
    {
      files: ['packages/mui-base/src/**/**{.ts,.tsx}'],
      rules: {
        'import/no-default-export': 'error',
        'import/prefer-default-export': 'off',
        'react-compiler/react-compiler': 'off',
        'no-irregular-whitespace': ['error', { skipComments: true }],
      },
    },
    {
      /**
       * Examples are for demonstration purposes and should not be considered a part of the library.
       * They don't contain ESLint setup, so we don't want them to contain ESLint directives
       * We do, however, want to keep the rules in place to ensure the examples are following
       * a reasonably similar code style as the library.
       */
      files: ['examples/**/*'],
      rules: {
        'no-console': 'off',
        'no-underscore-dangle': 'off',
        'import/no-unresolved': 'off',
        'import/namespace': 'off',
        'import/extensions': 'off',
        'import/named': 'off',
        'import/no-duplicates': 'off',
        'import/no-named-as-default': 'off',
        'import/default': 'off',
        'import/no-named-as-default-member': 'off',
        'import/order': 'off',
        // Reset the default until https://github.com/jsx-eslint/eslint-plugin-react/issues/3672 is fixed.
        'react/jsx-no-target-blank': ['error', { allowReferrer: false }],
        'react/prop-types': 'off',
        'no-irregular-whitespace': ['error', { skipJSXText: true, skipStrings: true }],
      },
    },
    {
      // TODO, move rule to be global, propagate: https://github.com/mui/material-ui/issues/42169
      files: ['examples/pigment-css-remix-ts/**/*'],
      rules: {
        'react/react-in-jsx-scope': 'off',
      },
    },
    {
      files: ['apps/**/*'],
      rules: {
        'import/no-relative-packages': 'off',
      },
    },
  ],
});
