import express, { Application } from 'express';
import { createUser, login } from '../user';

const router = express.Router();

router.post("/createUser", createUser);
router.post("/login", login)


export { router }
