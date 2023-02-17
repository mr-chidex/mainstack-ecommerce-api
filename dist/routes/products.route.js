"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRoutes = void 0;
const express_promise_router_1 = __importDefault(require("express-promise-router"));
const controllers_1 = require("../controllers");
const middlewares_1 = require("../middlewares");
const router = (0, express_promise_router_1.default)();
router
    .route('/')
    .post(middlewares_1.adminAuthMiddleware.auth, middlewares_1.uploads.single('image'), controllers_1.productsController.addNewProduct)
    .get(controllers_1.productsController.getAllProduct);
router
    .route('/:id')
    .get(controllers_1.productsController.getProduct)
    .patch(middlewares_1.adminAuthMiddleware.auth, middlewares_1.uploads.single('image'), controllers_1.productsController.updateProduct)
    .delete(middlewares_1.adminAuthMiddleware.auth, controllers_1.productsController.deleteProduct);
exports.productsRoutes = router;
