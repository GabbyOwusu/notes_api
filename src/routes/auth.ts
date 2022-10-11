import express, { Application, Request, Response, NextFunction } from 'express';
import { createUser, login } from '../controllers/auth_controller';

const router = express.Router();

router.post("/createUser", createUser);
router.post("/login", login);

export { router }
