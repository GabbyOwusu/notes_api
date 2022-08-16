import dotenv from 'dotenv';
import { Request, Response } from 'express';
import { PrismaClient, User } from '@prisma/client'

const prisma = new PrismaClient();

dotenv.config();


const getUserById = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body["userId"];

        //Crosscheck this

        if (!userId) return;
        const user = await prisma.user.findFirst({
            where: { id: userId }, select: { id: true, email: true },
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

// const setUpProfile = async (req: Request, res: Response) => {
//     try {
//         const { firstName, lastName, userName } = req.body;
//         const token = req.headers

//     } catch (error) {
//         console.log(`Couldn't create user >>>>>> ${error}`);
//         return res.status(500).send();
//     }
// }


export { getUserById }