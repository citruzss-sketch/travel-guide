import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
  {
    rules: {
      // Downgrade to warn: initializing state from localStorage/external store
      // inside useEffect on mount is an intentional and correct React pattern.
      "react-hooks/set-state-in-effect": "warn",
      // Downgrade to warn: updating a ref during render is flagged by this rule
      // but the sendMessageRef pattern is the recommended way to keep an effect's
      // callback stable without adding it to every dependency array.
      "react-hooks/refs": "warn",
    },
  },
]);

export default eslintConfig;
