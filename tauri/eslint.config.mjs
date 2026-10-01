import js from "@eslint/js"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import tseslint from "typescript-eslint"

const config = [
  { ignores: ["**/*.js"] },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: {
      "object-shorthand": [2, "always"],
      "prettier/prettier": [
        2,
        { objectWrap: "collapse", semi: false, trailingComma: "none" }
      ]
    }
  }
]

export default config
