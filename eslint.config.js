import * as config from '@lvce-editor/eslint-config'
import * as actions from '@lvce-editor/eslint-plugin-github-actions/dist/index.js'

export default [
  ...config.default,
  ...config.recommendedVirtualDom,
  ...actions.default,
  {
    rules: {
      '@cspell/spellchecker': 'off',
    },
  },
  {
    files: ['packages/e2e/**/*.ts'],
    rules: {
      '@typescript-eslint/prefer-readonly-parameter-types': 'off',
    },
  },
  {
    files: ['packages/ports-view/src/parts/**/*.ts'],
    ignores: ['packages/ports-view/src/parts/**/*VirtualDom/**/*.ts'],
    rules: {
      'virtual-dom/prefer-state-destructuring': 'off',
    },
  },
  {
    files: ['packages/ports-view/test/**/*.ts'],
    rules: {
      'virtual-dom/no-inline-event-handlers': 'off',
      'virtual-dom/prefer-constants': 'off',
      'virtual-dom/prefer-merge-class-names': 'off',
      'virtual-dom/prefer-state-destructuring': 'off',
    },
  },
]
