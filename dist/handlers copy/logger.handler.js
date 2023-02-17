"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const winston_1 = require("winston");
const { timestamp, label, prettyPrint, combine } = winston_1.format;
exports.logger = (0, winston_1.createLogger)({
    level: 'info',
    format: combine(label({ label: 'error occurred' }), timestamp(), prettyPrint()),
    defaultMeta: { service: 'user-service' },
    transports: [
        new winston_1.transports.File({ filename: 'error.log', level: 'error' }),
        new winston_1.transports.File({ filename: 'combined.log' }),
    ],
});
