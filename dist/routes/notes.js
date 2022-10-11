"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.router = void 0;
const express_1 = __importDefault(require("express"));
const notes_controller_1 = require("../controllers/notes_controller");
const router = express_1.default.Router();
exports.router = router;
router.post("/saveNotes", notes_controller_1.saveNotes);
router.post("/saveSingleNote", notes_controller_1.saveSingleNote);
router.post("/deleteNote", notes_controller_1.deleteNote);
router.get("/getNotes", notes_controller_1.getNotes);
//# sourceMappingURL=notes.js.map