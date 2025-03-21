import { Router } from "express";
import authMiddleware from "../middlewares/auth.js";
import {
  getLinks,
  getLink,
  newLink,
  hasPassword,
  verifyPassword,
} from "../controllers/linksController.js";
import { check } from "express-validator";

const router = Router();

router.post(
  "/",
  [check("original_name", "Sube un archivo").not().isEmpty()],
  authMiddleware,
  newLink
);

router.get("/", getLinks);

router.get("/:url", hasPassword, getLink);

router.post("/:url", verifyPassword, getLink)

export default router;
