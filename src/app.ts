import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from "body-parser";
import dotenv from 'dotenv';

import jwt from 'jsonwebtoken';
import { router as authRouter } from "./routes/auth";
import { router as userRouter } from "./routes/user";
import { router as notesRouter } from "./routes/notes";

dotenv.config();

const app: Application = express();

const PORT: string = process.env.PORT as string;

const TOKEN_SECRET: string = process.env.ACCESS_SECRET_TOKEN as string;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/user", authenticate, userRouter);
app.use("/notes", authenticate, notesRouter);

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
        const verify = jwt.verify(token, TOKEN_SECRET as string);
        // if (!verify) {
        //     return res.sendStatus(401).send({
        //         data: null, message: "Invalid token",
        //     });
        // }
        req.body = { "body": req.body, "userId": verify };
        console.log(req.body);
        next();
    } catch (error) {
        console.log(`Error authenticating user ${error}`);
        return res.sendStatus(500);
    }
}

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});




