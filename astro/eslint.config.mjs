import eslintPluginAstro from "eslint-plugin-astro"
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended"
import tseslint from "typescript-eslint"

const config = [
  { ignores: [".astro/**", ".wrangler/**"] },
  ...tseslint.configs.recommended,
  ...eslintPluginAstro.configs.recommended,
  eslintPluginPrettierRecommended,
  {
    rules: { "prettier/prettier": [2, { semi: false, trailingComma: "none" }] }
  }
]

export default config
