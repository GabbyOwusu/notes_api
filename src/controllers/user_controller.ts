import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient();

dotenv.config();

const getUserById = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body["userId"];
        console.log(req.body);
        if (!userId) return;
        const user = await prisma.user.findFirst({
            where: { id: userId },
            select: {
                id: true,
                email: true,
                firstName: true,
                lastName: true,
                username: true,
            },
        });
        if (!user) return res.status(404).send({
            status: 404,
            msg: "user doesnt exist"
        });
        return res.status(200).json({
            status: 200,
            data: user,
            msg: "user found",
        });
    } catch (error) {
        console.log(`Failed to get user ${error}`)
        res.status(500).send()
    }
}

const setupProfile = async (req: Request, res: Response) => {
    try {
        const { firstName, lastName, userName } = req.body["body"];
        const { userId } = req.body["userId"];
        const user = prisma.user.findFirst({ where: { id: userId } });
        if (!user) return res.status(404).send({
            data: null,
            status: 404,
            msg: "user doesnt exist"
        });
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: { firstName: firstName, username: userName, lastName: lastName, },
            select: { id: true, email: true, firstName: true, lastName: true, username: true },
        });
        return res.status(201).send({
            data: updatedUser,
            message: "User updated succesfully",
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send();
    }
}


export { getUserById, setupProfile }