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
exports.login = exports.createUser = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!validateEmail(email)) {
            return res.status(401).send({
                data: null,
                message: "Invalid email",
            });
        }
        const exists = yield prisma.user.findFirst({
            where: { email: email }
        });
        if (exists) {
            return res.send({
                data: null,
                message: "user already exists"
            });
        }
        const salt = yield bcrypt_1.default.genSalt();
        const hashedPassword = yield bcrypt_1.default.hash(password, salt);
        const user = yield prisma.user.create({
            data: { email: email, password: hashedPassword },
        });
        const payload = { userId: user.id };
        const token = jsonwebtoken_1.default.sign(payload, process.env.ACCESS_SECRET_TOKEN);
        const updatedUser = yield prisma.user.update({
            where: { id: user.id },
            data: { token: token },
            select: { id: true, email: true, token: true },
        });
        return res.status(201).send({
            status: 201,
            data: updatedUser,
            msg: "user created successfully",
        });
    }
    catch (error) {
        console.log(`Couldn't create user >>>>>> ${error}`);
        return res.status(500).send();
    }
});
exports.createUser = createUser;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const { email, password } = req.body;
        const user = yield prisma.user.findFirst({
            where: { email: email },
            select: {
                token: true,
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                password: true
            },
        });
        if (user == null) {
            return res.status(404).json({
                data: null,
                message: "user does not exist"
            });
        }
        if (yield bcrypt_1.default.compare(password, user.password)) {
            //prevent sending back password
            return res.status(200).json({
                "message": "login successful",
                data: user
            });
        }
        else {
            return res.status(403).send({
                status: 403,
                data: null,
                msg: "Incorrect email/password",
            });
        }
    }
    catch (error) {
        console.log(error);
        res.status(500).send();
    }
});
exports.login = login;
const emailRegexp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
function validateEmail(email) {
    return emailRegexp.test(email);
}
//# sourceMappingURL=auth_controller.js.map