export default {
  extends: ['stylelint-config-standard'],
  rules: {
    'at-rule-no-unknown': [
      true,
      {
        ignoreAtRules: [
          'plugin',
          'theme',
          'source',
          'utility',
          'variant',
          'custom-variant',
          'config',
          'tailwind',
          'apply',
          'layer',
          'source',
        ],
      },
    ],
  },
};
