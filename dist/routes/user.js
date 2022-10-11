"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user_controller");
const router = express_1.default.Router();
exports.router = router;
router.get("/getUser", user_controller_1.getUserById);
router.post("/setupProfile", user_controller_1.setupProfile);
//# sourceMappingURL=user.js.map