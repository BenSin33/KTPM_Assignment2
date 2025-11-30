// frontend/cypress.config.js

const { defineConfig } = require("cypress");

module.exports = defineConfig({
    e2e: {
        // ⚠️ QUAN TRỌNG: Thay 3000 bằng cổng (port) ứng dụng React đang chạy
        baseUrl: 'http://localhost:5173',
        setupNodeEvents(on, config) {
            // implement node event listeners here
        },
    },
});