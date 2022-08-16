import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from "body-parser";
import dotenv from 'dotenv';
dotenv.config();
import jwt from 'jsonwebtoken';
import { router as authRouter } from "./routes/auth";
import { router as userRouter } from "./routes/user";


const app: Application = express();

const PORT = process.env.PORT;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", authRouter);
app.use("/user", authenticate, userRouter);

app.get("/", async (_, res: Response) => {
    res.status(200).send({
        status: "200",
        message: "Server is up and running",
    });
});

async function authenticate(req: Request, res: Response, next: NextFunction) {
    console.log(`Running middleware`);
    try {
        const authHeader = req.headers["authorization"];
        console.log(`Auth header ${authHeader}`);
        const token = authHeader?.split(" ")[1];
        console.log(`Token ${token}`);
        if (!token) return res.sendStatus(401);
        jwt.verify(token, process.env.ACCESS_SECRET_TOKEN as string, (error, payload) => {
            if (error) {
                console.log(`Failed to verify token ${error}`);
                return res.sendStatus(401);
            }
            req.body = payload;
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




