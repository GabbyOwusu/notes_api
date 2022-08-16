import express from "express";
import { getUserById } from "../controllers/user_controller";

const router = express.Router();

router.get("/getUser", getUserById);

export { router }