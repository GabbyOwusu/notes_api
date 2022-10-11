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
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const dotenv_1 = __importDefault(require("dotenv"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = require("./routes/auth");
const user_1 = require("./routes/user");
const notes_1 = require("./routes/notes");
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT;
const TOKEN_SECRET = process.env.ACCESS_SECRET_TOKEN;
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: true }));
app.use("/auth", auth_1.router);
app.use("/user", authenticate, user_1.router);
app.use("/notes", authenticate, notes_1.router);
app.get("/", (_, res) => {
    res.status(200).send({
        status: "200",
        message: "Server is up and running",
    });
});
function authenticate(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const authHeader = req.headers["authorization"];
            const token = authHeader === null || authHeader === void 0 ? void 0 : authHeader.split(" ")[1];
            if (!token)
                return res.sendStatus(401);
            const verify = jsonwebtoken_1.default.verify(token, TOKEN_SECRET);
            // if (!verify) {
            //     return res.sendStatus(401).send({
            //         data: null, message: "Invalid token",
            //     });
            // }
            req.body = { "body": req.body, "userId": verify };
            console.log(req.body);
            next();
        }
        catch (error) {
            console.log(`Error authenticating user ${error}`);
            return res.sendStatus(500);
        }
    });
}
app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
//# sourceMappingURL=index.js.map