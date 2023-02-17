"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateProductParams = void 0;
const joi_1 = __importDefault(require("joi"));
const validateProductParams = (params) => {
    return joi_1.default.object({
        name: joi_1.default.string().trim().required(),
        brand: joi_1.default.optional(),
        description: joi_1.default.string().trim().required(),
        rating: joi_1.default.optional(),
        price: joi_1.default.number().required(),
        countInStock: joi_1.default.optional(),
    }).validate(params);
};
exports.validateProductParams = validateProductParams;
