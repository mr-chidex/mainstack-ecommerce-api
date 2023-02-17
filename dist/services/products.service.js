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
exports.productsService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const slugify_1 = __importDefault(require("slugify"));
const handlers_1 = require("../handlers");
const models_1 = require("../models");
const utils_1 = require("../utils");
const cloudinary_utils_1 = __importDefault(require("../utils/cloudinary.utils"));
const validators_1 = require("../validators");
class ProductsService {
    validateProductParams(body) {
        const { error } = (0, validators_1.validateProductParams)(body);
        if (error) {
            return (0, utils_1.errorResponse)(error.details[0].message, 400);
        }
    }
    uploadImage(path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!path)
                return (0, utils_1.errorResponse)('Product image must be uploaded', 400);
            try {
                const uploadedImage = yield cloudinary_utils_1.default.v2.uploader.upload(path);
                return {
                    url: uploadedImage.secure_url,
                    imageId: uploadedImage.public_id,
                };
            }
            catch (err) {
                handlers_1.logger.log('error', `Error uploading image: ${err === null || err === void 0 ? void 0 : err.message}`);
                return (0, utils_1.errorResponse)('Error uploading image', 400);
            }
        });
    }
    addProduct(body, file) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateProductParams(body);
            const { name, description, brand, price, countInStock } = body;
            // upload product image to cloudinary
            const image = yield this.uploadImage(file === null || file === void 0 ? void 0 : file.path);
            const product = yield models_1.Product.create({
                name,
                image,
                description,
                brand,
                price,
                countInStock,
                productUrl: (0, slugify_1.default)(name, { lower: true, strict: true }), //creating a url for the product,
            });
            return {
                success: true,
                message: 'Product successfully added',
                data: product,
            };
        });
    }
    getProducts(query) {
        return __awaiter(this, void 0, void 0, function* () {
            const total = yield models_1.Product.countDocuments();
            const page = parseInt(query === null || query === void 0 ? void 0 : query.page) || 1;
            const limit = parseInt(query === null || query === void 0 ? void 0 : query.offset) || total;
            const start = (page - 1) * limit;
            const products = yield models_1.Product.find().sort({ _id: -1 }).skip(start).limit(limit);
            return {
                success: true,
                message: 'Success',
                data: { totalProduct: total, products },
            };
        });
    }
    getProductById(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!mongoose_1.default.isValidObjectId(productId)) {
                return (0, utils_1.errorResponse)('invalid product id', 400);
            }
            const product = yield models_1.Product.findById(productId);
            if (!product) {
                return (0, utils_1.errorResponse)('Product does not exist', 404);
            }
            return product;
        });
    }
    getProduct(productId) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.getProductById(productId);
            return {
                success: true,
                message: 'Success',
                data: product,
            };
        });
    }
    getProductByUrl(productUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield models_1.Product.findOne({ productUrl });
            if (!product) {
                return (0, utils_1.errorResponse)('Product does not exist', 404);
            }
            return product;
        });
    }
    updateProductImage(product, path) {
        return __awaiter(this, void 0, void 0, function* () {
            if (path) {
                try {
                    //delete old image
                    product.image.imageId && (yield cloudinary_utils_1.default.v2.uploader.destroy(product.image.imageId));
                    //upload new image
                    const uploadedImage = yield cloudinary_utils_1.default.v2.uploader.upload(path);
                    return {
                        url: uploadedImage.secure_url,
                        imageId: uploadedImage.public_id,
                    };
                }
                catch (err) {
                    handlers_1.logger.log('error', `Error uploading image: ${err === null || err === void 0 ? void 0 : err.message}`);
                    return (0, utils_1.errorResponse)('Error uploading image', 400);
                }
            }
            return null;
        });
    }
    updateProduct(body, productId, file) {
        return __awaiter(this, void 0, void 0, function* () {
            this.validateProductParams(body);
            const { name, description, brand, price, countInStock } = body;
            const product = yield this.getProductById(productId);
            product.name = name || product.name;
            product.description = description || product.description;
            product.brand = brand || product.brand;
            product.price = price || product.price;
            product.countInStock = countInStock || product.countInStock;
            product.productUrl = (0, slugify_1.default)(product.name, { lower: true, strict: true });
            const image = yield this.updateProductImage(product, file === null || file === void 0 ? void 0 : file.path);
            product.image = image || product.image;
            yield product.save();
            return {
                success: true,
                message: 'Product successfully updated',
                date: product,
            };
        });
    }
    deleteProduct(productId) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const product = yield this.getProductById(productId);
            //delete image
            ((_a = product.image) === null || _a === void 0 ? void 0 : _a.imageId) && (yield cloudinary_utils_1.default.v2.uploader.destroy(product.image.imageId));
            yield product.remove();
            return {
                success: true,
                message: 'Product successfully deleted',
            };
        });
    }
}
exports.productsService = new ProductsService();
