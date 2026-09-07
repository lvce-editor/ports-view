import { defineConfig } from 'eslint/config'
import * as config from '@lvce-editor/eslint-config'

export default defineConfig([
  ...config.default,
  ...config.recommendedVirtualDom,
  ...config.recommendedActions,
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
    files: ['packages/ports-view/test/**/*.ts'],
    rules: {
      'virtual-dom/no-inline-event-handlers': 'off',
      'virtual-dom/prefer-constants': 'off',
      'virtual-dom/prefer-merge-class-names': 'off',
    },
  },
])
