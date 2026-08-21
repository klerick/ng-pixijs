const nx = require('@nx/eslint-plugin');
const baseConfig = require('../../eslint.config.js');

module.exports = [
  ...baseConfig,
  ...nx.configs['flat/angular'],
  ...nx.configs['flat/angular-template'],
  {
    files: ['**/*.ts'],
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          // prefix: 'app',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          // prefix: 'app',
          style: 'kebab-case',
        },
      ],
      // Newly enabled by the angular-eslint 22 preset. Angular 22 made OnPush the
      // default strategy, and the v22 migration added an explicit
      // `ChangeDetectionStrategy.Eager` to AppComponent to preserve the old
      // always-check behaviour — which this rule then flags. Off until AppComponent
      // is actually reviewed for OnPush.
      '@angular-eslint/prefer-on-push-component-change-detection': 'off',
    },
  },
  {
    files: ['**/*.html'],
    // Override or add rules here
    rules: {},
  },
];
