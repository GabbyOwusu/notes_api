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
exports.setupProfile = exports.getUserById = void 0;
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
dotenv_1.default.config();
const getUserById = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body["userId"];
        console.log(req.body);
        if (!userId)
            return;
        const user = yield prisma.user.findFirst({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                username: true,
            },
        });
        if (!user)
            return res.status(404).send({
                status: 404,
                msg: "user doesnt exist"
            });
        return res.status(200).json({
            status: 200,
            data: user,
            msg: "user found",
        });
    }
    catch (error) {
        console.log(`Failed to get user ${error}`);
        res.status(500).send();
    }
});
exports.getUserById = getUserById;
const setupProfile = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { firstName, lastName, userName } = req.body["body"];
        const { userId } = req.body["userId"];
        const user = prisma.user.findFirst({ where: { id: userId } });
        if (!user)
            return res.status(404).send({
                data: null,
                status: 404,
                msg: "user doesnt exist"
            });
        const updatedUser = yield prisma.user.update({
            where: { id: userId },
            data: { firstName: firstName, username: userName, lastName: lastName, },
            select: { id: true, email: true, firstName: true, lastName: true, username: true },
        });
        return res.status(201).send({
            data: updatedUser,
            message: "User updated succesfully",
        });
    }
    catch (error) {
        console.log(error);
        return res.status(500).send();
    }
});
exports.setupProfile = setupProfile;
//# sourceMappingURL=user_controller.js.map