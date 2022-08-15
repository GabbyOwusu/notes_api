import bcrypt from "bcrypt";
import express, { Application, Request, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

// import jsonwebtoken from "jsonwebtoken";

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
        const hashed = await bcrypt.hash(password, salt);
        const user = await prisma.user.create({
            data: { email: email, password: hashed },
            select: { password: false }
        });
        return res.status(201).send({
            status: "201",
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
            res.status(200).json({ data: user });
        }
    } catch (error) {
        res.status(500).send()
    }
}

export { createUser, login }