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
exports.authService = exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const models_1 = require("../models");
const errorResponse_utils_1 = require("../utils/errorResponse.utils");
const validators_1 = require("../validators");
class AuthService {
    findUserByEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield models_1.User.findOne({ email });
        });
    }
    hashPassword(password) {
        return __awaiter(this, void 0, void 0, function* () {
            const salt = yield bcrypt_1.default.genSalt(12);
            return yield bcrypt_1.default.hash(password, salt);
        });
    }
    validateRegisterationParams(body) {
        const { error } = (0, validators_1.validateRegisterParams)(body);
        if (error) {
            return (0, errorResponse_utils_1.errorResponse)(error.details[0].message, 400);
        }
    }
    validateRegisterationEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const isEmail = yield this.findUserByEmail(email);
            if (isEmail) {
                return (0, errorResponse_utils_1.errorResponse)('Email already in use', 400);
            }
        });
    }
    register(body) {
        return __awaiter(this, void 0, void 0, function* () {
            //check for errors in body data
            this.validateRegisterationParams(body);
            const { name, email, password } = body;
            // check if email is already in use
            yield this.validateRegisterationEmail(email);
            // hash password
            const hashPassword = yield this.hashPassword(password);
            yield models_1.User.create({
                name,
                email,
                password: hashPassword,
            });
            return {
                success: true,
                message: 'Account successfully created',
            };
        });
    }
    validateCredentials(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            //check if email is correct
            const user = yield models_1.User.findOne({ email });
            if (!user) {
                return (0, errorResponse_utils_1.errorResponse)('Email or Password is incorrect', 400);
            }
            //check if password is correct
            const isPassword = yield bcrypt_1.default.compare(password, user.password);
            if (!isPassword) {
                return (0, errorResponse_utils_1.errorResponse)('Email or Password is incorrect', 400);
            }
            return user;
        });
    }
    getToken(user) {
        return jsonwebtoken_1.default.sign({
            iat: Date.now(),
            iss: 'mainstack',
            userId: user._id,
        }, config_1.default.SECRET_KEY, { expiresIn: '48h' });
    }
    login(body) {
        return __awaiter(this, void 0, void 0, function* () {
            const { error } = (0, validators_1.validateLoginParams)(body);
            if (error) {
                return (0, errorResponse_utils_1.errorResponse)(error.details[0].message, 400);
            }
            const { email, password } = body;
            const user = yield this.validateCredentials(email, password);
            const token = this.getToken(user);
            return {
                success: true,
                message: 'Login successful',
                data: token,
            };
        });
    }
}
exports.AuthService = AuthService;
exports.authService = new AuthService();
