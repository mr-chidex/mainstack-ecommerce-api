"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    name: {
        type: String,
        required: true,
    },
    image: {
        url: {
            type: String,
            required: true,
            default: '',
        },
        imageId: {
            type: String,
            required: true,
            default: '',
        },
    },
    brand: {
        type: String,
        default: '',
    },
    description: {
        type: String,
        required: true,
    },
    rating: {
        type: Number,
        default: 0,
    },
    price: {
        type: Number,
        required: true,
        default: 0,
    },
    countInStock: {
        type: Number,
        required: true,
        default: 0,
    },
    productUrl: String,
});
exports.Product = (0, mongoose_1.model)('Products', productSchema);
