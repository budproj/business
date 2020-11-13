"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const common_1 = require("@nestjs/common");
const core_1 = require("@nestjs/core");
const platform_fastify_1 = require("@nestjs/platform-fastify");
const logger_1 = require("../../lib/logger");
const bootstrap_module_1 = require("./bootstrap.module");
const config_1 = require("@nestjs/config");
async function bootstrap() {
    const app = await core_1.NestFactory.create(bootstrap_module_1.default, new platform_fastify_1.FastifyAdapter());
    app.useGlobalPipes(new common_1.ValidationPipe());
    app.useLogger(logger_1.default);
    const configService = app.get(config_1.ConfigService);
    await app.listen(configService.get('port'));
}
exports.default = bootstrap;
//# sourceMappingURL=index.js.map