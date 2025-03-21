import { Router } from "express";
import {
  authenticateUser,
  getAuthenticatedUser,
} from "../controllers/authController.js";
import { check } from "express-validator";
import authMiddleware from "../middlewares/auth.js";

const router = Router();

router.get("/", authMiddleware, getAuthenticatedUser);

router.post(
  "/",
  [
    check("email", "Email no valido").isEmail(),
    check("password", "password no valido").not().isEmpty(),
  ],
  authenticateUser
);

export default router;
