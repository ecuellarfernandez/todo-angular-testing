import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: "http://localhost:4200",
    env:{
      apiUrl: 'http://localhost:8080'
    },
    supportFile: "cypress/support/e2e.ts",
  },
});
