import js from "@eslint/js"
import { FlatCompat } from "@eslint/eslintrc"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"

const compat = new FlatCompat({ recommendedConfig: js.configs.recommended })

const config = [
  { ignores: ["dist/**"] },
  ...compat.extends(
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended"
  ),
  eslintPluginPrettierRecommended,
  {
    rules: { "prettier/prettier": [2, { semi: false, trailingComma: "none" }] }
  }
]

export default config
