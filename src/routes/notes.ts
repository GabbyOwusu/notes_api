import express from 'express';
import { saveNotes, getNotes, saveSingleNote, deleteNote } from '../controllers/notes_controller';

const router = express.Router();

router.post("/saveNotes", saveNotes);
router.post("/saveSingleNote", saveSingleNote);
router.post("/deleteNote", deleteNote);
router.get("/getNotes", getNotes);

export { router }
