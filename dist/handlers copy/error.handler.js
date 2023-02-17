"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ErrorHandler = void 0;
const winston_1 = require("winston");
const config_1 = __importDefault(require("../config"));
const logger_handler_1 = require("./logger.handler");
class ErrorHandler {
    static error(err, _req, res, _next) {
        return __awaiter(this, void 0, void 0, function* () {
            logger_handler_1.logger.log({
                level: 'info',
                message: err.message,
            });
            logger_handler_1.logger.log({
                level: 'error',
                message: err.message,
            });
            const code = err.statusCode || Number(err === null || err === void 0 ? void 0 : err.code) || 500;
            if (config_1.default.NODE_ENV !== 'production') {
                logger_handler_1.logger.add(new winston_1.transports.Console({
                    format: winston_1.format.simple(),
                }));
                return res.status(code).json({ message: err.message, error: true, stack: err.stack, code });
            }
            res.status(code).json({ message: err.message, error: true, code });
        });
    }
}
exports.ErrorHandler = ErrorHandler;
