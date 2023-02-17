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
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsController = void 0;
const services_1 = require("../services");
class ProductsController {
    //@POST
    addNewProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield services_1.productsService.addProduct(req.body, req.file);
            res.status(201).json(Object.assign({}, response));
        });
    }
    //@GET
    getAllProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield services_1.productsService.getProducts(req.query);
            res.status(200).json(Object.assign({}, response));
        });
    }
    //@GET
    getProduct(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield services_1.productsService.getProduct((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
            res.status(200).json(Object.assign({}, response));
        });
    }
    //@PATCH
    updateProduct(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield services_1.productsService.updateProduct(req.body, (_a = req.params) === null || _a === void 0 ? void 0 : _a.id, req.file);
            res.status(200).json(Object.assign({}, response));
        });
    }
    //@DELETE
    deleteProduct(req, res) {
        var _a;
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield services_1.productsService.deleteProduct((_a = req.params) === null || _a === void 0 ? void 0 : _a.id);
            res.status(200).json(Object.assign({}, response));
        });
    }
}
exports.productsController = new ProductsController();
