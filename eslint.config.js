import { defineConfig } from 'eslint/config'
import * as config from '@lvce-editor/eslint-config'

export default defineConfig([
  ...config.default,
  ...config.recommendedRegex,
  ...config.recommendedVirtualDom,
  ...config.recommendedActions,
  ...config.recommendedE2e,
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
    rules: {
      'virtual-dom/no-inline-event-handlers': 'off',
      'virtual-dom/prefer-constants': 'off',
      'virtual-dom/prefer-merge-class-names': 'off',
      'virtual-dom/hoist-class-names': 'off',
      '@typescript-eslint/no-deprecated': 'off',
    },
  },
])
