import { Note, PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();


const saveNote = async (req: Request, res: Response) => {
    try {
        // const { userId } = req.body["userId"];
        // const data = req.body["body"] as Note[];

        // const user = await prisma.user.findFirst({
        //     where: { id: userId }
        // });
        // const update = await prisma.user.update({
        //     where: { id: userId },
        //     data: { notes: data },
        //     select: { id: true, email: true, firstName: true, lastName: true, username: true, },
        // });

    } catch (e) {
        console.log(e);
        res.status(500).send({
            data: null, message: "Internal Server Error"
        });
    }
}


const getNotes = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body["userId"];
        const notes = await prisma.note.findMany({
            where: { authorId: userId },
        });
        if (!notes) return res.status(404).send({
            data: null, message: "Can't find notes",
        });
        res.status(200).send({
            data: notes,
            message: "success"
        });

    } catch (e) {
        console.log(e);
        res.status(500).send({
            data: null, message: "Internal server error,"
        });
    }

}

export { saveNote, getNotes }