import { Note, PrismaClient, User } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();


const saveNotes = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body["userId"];
        const data = req.body["body"] as Note[];
        data.forEach((note) => { note.authorId = userId });
        const notes = await prisma.note.createMany({
            data: data
        });
        res.status(201).json({
            "status": 201,
            "message": "notes saved successfully",
        });
    } catch (e) {
        console.log(e);
        res.status(500).send({
            data: null, message: "Internal Server Error"
        });
    }
}

const deleteNote = async (req: Request, res: Response) => {
    const { userId } = req.body["userId"];
    const { id } = req.body["body"];
    const existingNote = await prisma.note.findFirst({
        where: { id: id }
    });
    if (!existingNote) {
        return res.status(404).send({ 'message': 'Not found' });
    } else {
        await prisma.note.delete({
            where: { id: id }
        });
        return res.status(200).send({ 'message': 'deleted successfully' });
    }
}

const saveSingleNote = async (req: Request, res: Response) => {
    try {
        const { userId } = req.body["userId"];
        const data = req.body["body"] as Note;
        console.log(userId);
        if (!data.id) {
            data.authorId = userId;
            await prisma.note.create({
                data: {
                    title: data.title,
                    body: data.body,
                    authorId: userId,
                },
            });
            return res.status(201).send({ 'message': 'saved successfully' })
        }
        const existingNote = await prisma.note.findFirst({
            where: { id: data.id }
        });
        if (!existingNote) {
            data.authorId = userId;
            await prisma.note.create({
                data: {
                    title: data.title,
                    body: data.body,
                    authorId: userId,
                },
            });
            return res.status(201).send({ 'message': 'saved successfully' })
        } else {
            await prisma.note.update({
                where: { id: data.id },
                data: data,
            });
            return res.status(201).send({ 'message': 'updated successfully' })
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send({
            data: null, message: "Internal Server Error"
        });
    }
}

// const updateNote = async (req: Request, res: Response) => {
//     try {
//         const { userId } = req.body["userId"];
//         const data = req.body["body"] as Note;
//         const existingNote = await prisma.note.findFirst({
//             where: { id: data.id }
//         });
//         if (!existingNote) {
//             data.authorId = userId;
//             await prisma.note.create({
//                 data: data,
//             });
//             return res.status(201).send({ 'message': 'success' })
//         } else {
//             await prisma.note.update({
//                 where: { id: data.id },
//                 data: data,
//             });
//             return res.status(201).send({ 'message': 'success' })
//         }
//     } catch (e) {
//         console.log(e);
//         res.status(500).send({
//             data: null, message: "Internal Server Error"
//         });
//     }
// }


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

export { saveNotes, getNotes, saveSingleNote, deleteNote }