"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { PORT, } = process.env;
const config = () => ({
    port: parseInt(PORT, 10) || 3000,
});
exports.default = config;
//# sourceMappingURL=app.js.map