import express, { Application, Request, Response, NextFunction } from 'express';
import { saveNote, getNotes } from '../controllers/notes_controller';

const router = express.Router();

router.post("/saveNotes", saveNote);
router.get("/getNotes", getNotes);

export { router }
