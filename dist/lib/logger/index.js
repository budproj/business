"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nest_winston_1 = require("nest-winston");
const winston_1 = require("winston");
const chalk_1 = require("chalk");
const { Console } = winston_1.transports;
const { combine, timestamp, prettyPrint, colorize, printf } = winston_1.format;
const customFormat = ({ level, message, label, timestamp }) => `${chalk_1.cyan('➤')} ${chalk_1.grey(`[${timestamp}]`)} ${label !== null && label !== void 0 ? label : '-'} ${level}: ${message}`;
const Logger = nest_winston_1.WinstonModule.createLogger({
    level: 'info',
    defaultMeta: { service: 'bud@business' },
    format: combine(timestamp({ format: 'YYYY-MM-DD HH:mm:ss.SSS' }), prettyPrint()),
    transports: [
        new Console({
            format: combine(colorize(), printf(customFormat)),
        }),
    ],
});
exports.default = Logger;
//# sourceMappingURL=index.js.map