import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import prettier from "eslint-config-prettier";
import prettierPlugin from "eslint-plugin-prettier";

export default defineConfig([
  ...nextVitals,
  ...nextTs,

  prettier,

  {
    plugins: {
      prettier: prettierPlugin,
    },
    rules: {
      "prettier/prettier": "error",
      "@next/next/no-img-element": "off",
      "no-unused-vars": "off",
    },
  },

  {
    // Tailwind v3 loads this file with require() (no "type": "module" in package.json).
    files: ["tailwind.config.js"],
    rules: {
      "@typescript-eslint/no-require-imports": "off",
    },
  },

  globalIgnores([".next/**", "out/**", "build/**", "next-env.d.ts"]),
]);
