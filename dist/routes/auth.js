"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth_controller");
const router = express_1.default.Router();
exports.router = router;
router.post("/createUser", auth_controller_1.createUser);
router.post("/login", auth_controller_1.login);
//# sourceMappingURL=auth.js.map