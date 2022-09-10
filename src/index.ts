import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import { router as authRouter } from "./routes/auth";
import { router as userRouter } from "./routes/user";


const app: Application = express();

const PORT = process.env.PORT;

const TOKEN_SECRET = process.env.ACCESS_SECRET_TOKEN as string;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/user", authenticate, userRouter);

app.get("/", (_, res: Response) => {
    res.status(200).send({
        status: "200",
        message: "Server is up and running",
    });
});

async function authenticate(req: Request, res: Response, next: NextFunction) {
    try {
        const authHeader = req.headers["authorization"];
        const token = authHeader?.split(" ")[1];
        if (!token) return res.sendStatus(401);
        jwt.verify(token, TOKEN_SECRET, (error, payload) => {
            if (error) return res.sendStatus(401).send({
                data: null, message: "Invalid token",
            });
            req.body = { "body": req.body, "userId": payload };
            next();
        });
    } catch (error) {
        console.log(`Error authenticating user ${error}`);
        return res.sendStatus(500);
    }
}

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});




