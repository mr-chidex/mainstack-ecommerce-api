"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const app_1 = __importDefault(require("./app"));
const config_1 = __importDefault(require("./config"));
const handlers_1 = require("./handlers");
const PORT = config_1.default.PORT || 5000;
// connect database and start server
mongoose_1.default.set('strictQuery', true);
mongoose_1.default
    .connect(config_1.default.DATABASE_URL)
    .then(() => {
    console.log('db successfully connected');
    // start server
    app_1.default.listen(PORT, () => console.log(`server running on PORT:: 🚀💥>>> ${PORT}`));
})
    .catch((_error) => {
    handlers_1.logger.log('error', 'error connecting to database');
});
