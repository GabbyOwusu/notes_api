import express from "express";
import { getUserById, setupProfile } from "../controllers/user_controller";

const router = express.Router();

router.get("/getUser", getUserById);
router.post("/setupProfile", setupProfile);

export { router }