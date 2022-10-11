"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.saveSingleNote = exports.getNotes = exports.saveNotes = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const saveNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body["userId"];
        const data = req.body["body"];
        data.forEach((note) => { note.authorId = userId; });
        const notes = yield prisma.note.createMany({
            data: data
        });
        res.status(201).json({
            "status": 201,
            "message": "notes saved successfully",
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({
            data: null, message: "Internal Server Error"
        });
    }
});
exports.saveNotes = saveNotes;
const deleteNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body["userId"];
    const { id } = req.body["body"];
    const existingNote = yield prisma.note.findFirst({
        where: { id: id }
    });
    if (!existingNote) {
        return res.status(404).send({ 'message': 'Not found' });
    }
    else {
        yield prisma.note.delete({
            where: { id: id }
        });
        return res.status(200).send({ 'message': 'deleted successfully' });
    }
});
exports.deleteNote = deleteNote;
const saveSingleNote = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body["userId"];
        const data = req.body["body"];
        console.log(userId);
        if (!data.id) {
            data.authorId = userId;
            yield prisma.note.create({
                data: {
                    title: data.title,
                    body: data.body,
                    authorId: userId,
                },
            });
            return res.status(201).send({ 'message': 'saved successfully' });
        }
        const existingNote = yield prisma.note.findFirst({
            where: { id: data.id }
        });
        if (!existingNote) {
            data.authorId = userId;
            yield prisma.note.create({
                data: {
                    title: data.title,
                    body: data.body,
                    authorId: userId,
                },
            });
            return res.status(201).send({ 'message': 'saved successfully' });
        }
        else {
            yield prisma.note.update({
                where: { id: data.id },
                data: data,
            });
            return res.status(201).send({ 'message': 'updated successfully' });
        }
    }
    catch (e) {
        console.log(e);
        res.status(500).send({
            data: null, message: "Internal Server Error"
        });
    }
});
exports.saveSingleNote = saveSingleNote;
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
const getNotes = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.body["userId"];
        const notes = yield prisma.note.findMany({
            where: { authorId: userId },
        });
        if (!notes)
            return res.status(404).send({
                data: null, message: "Can't find notes",
            });
        res.status(200).send({
            data: notes,
            message: "success"
        });
    }
    catch (e) {
        console.log(e);
        res.status(500).send({
            data: null, message: "Internal server error,"
        });
    }
});
exports.getNotes = getNotes;
//# sourceMappingURL=notes_controller.js.map