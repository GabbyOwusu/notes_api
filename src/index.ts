import express, { Application, Request, Response, NextFunction } from 'express';
import bodyParser from "body-parser";
import { router as userRouter } from "../src/routes/user";

const app: Application = express();

const PORT = 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/auth", userRouter);

app.get("/", async (_, res: Response) => {
    res.status(200).send({
        status: "200",
        message: "Server is up and running",
    });
});

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});




