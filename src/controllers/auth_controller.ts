import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client'


const prisma = new PrismaClient();

const createUser = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;
        if (!validateEmail(email)) {
            return res.status(401).send({
                data: null,
                message: "Invalid email",
            })
        }
        const exists = await prisma.user.findFirst({
            where: { email: email }
        });
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
        }) as User;
        const payload = { userId: user.id };
        const token = jwt.sign(payload, process.env.ACCESS_SECRET_TOKEN as string);
        const updatedUser = await prisma.user.update({
            where: { id: user.id },
            data: { token: token },
            select: { id: true, email: true, token: true },

        });
        return res.status(201).send({
            status: 201,
            data: updatedUser,
            msg: "user created successfully",
        });
    } catch (error) {
        console.log(`Couldn't create user >>>>>> ${error}`);
        return res.status(500).send();
    }

};


const login = async (req: Request, res: Response) => {
    try {
        console.log(req.body);
        const { email, password } = req.body;
        const user = await prisma.user.findFirst({
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
        if (await bcrypt.compare(password, user.password)) {
            //prevent sending back password
            return res.status(200).json({
                "message": "login successful",
                data: user
            });
        } else {
            return res.status(403).send({
                status: 403,
                data: null,
                msg: "Incorrect email/password",
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send()
    }
}

const emailRegexp: RegExp = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;


function validateEmail(email: string): boolean {
    return emailRegexp.test(email);
}
export { createUser, login }