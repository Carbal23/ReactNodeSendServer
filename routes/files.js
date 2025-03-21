import { Router } from "express";
import authMiddleware from "../middlewares/auth.js";
import { downloadFile, uploadFile, deleteFile } from "../controllers/fileController.js";

const router = Router();

router.post("/",
    authMiddleware,
    uploadFile,
);

router.get("/:filename",
    authMiddleware,
    downloadFile,
);

export default router;