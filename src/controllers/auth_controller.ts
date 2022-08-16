import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient();




const createUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const exists = await prisma.user.findFirst({
            where: { email: email }
        });

        //TODO: add email verification

        if (exists) {
            return res.send({
                data: null,
                message: "user already exists"
            });
        }
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(password, salt);
        const user: User = await prisma.user.create({
            data: { email: email, password: hashedPassword },
            select: { id: true, email: true },
        }) as User;
        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN as string);
        return res.status(201).send({
            status: 201,
            token: token,
            data: user,
            msg: "user created successfully",
        });
    } catch (error) {
        console.log(`Couldn't create user >>>>>> ${error}`);
        return res.status(500).send();
    }

};


const login = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findFirst({ where: { email: email } });
        if (user == null) {
            return res.status(404).json({
                data: null,
                message: "user does not exist"
            });
        }
        if (await bcrypt.compare(password, user.password)) {
            return res.status(200).json({ data: user });
        } else {
            return res.status(403).send({
                status: 403,
                data: null,
                msg: "Incorrect email/password",
            });
        }
    } catch (error) {
        res.status(500).send()
    }
}



export { createUser, login }