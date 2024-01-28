module.exports = {
  root: true,
  env: { browser: true, es2020: true },
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:react-hooks/recommended",
    "airbnb-base",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["dist", ".eslintrc.cjs", "vite.config.ts"],
  parser: "@typescript-eslint/parser",
  plugins: ["react-refresh", "prettier"],
  rules: {
    "prettier/prettier": [
      "error",
      {
        endOfLine: "crlf",
      },
    ],
    "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
    "no-shadow": "off",
    "import/no-extraneous-dependencies": "off",
    "import/no-unresolved": "off",
    "import/extensions": "off",
    "no-unused-vars":"off",
    "class-methods-use-this":"off",
    "@typescript-eslint/no-unused-vars":"warn",
    "@typescript-eslint/no-explicit-any": "off",
    "no-console":"off",
    "block-no-empty": "off",
    "no-param-reassign": "off"
  },
};

