import { Router } from "express";
import { newUser } from "../controllers/usersController.js";
import { check } from "express-validator";
const router = Router();

router.post("/", [
    check("name", "Nombre no valido").not().isEmpty(),
    check('email', "Email no valido").isEmail(),
    check('password',"Debe ser de almenos 6 caracteres").isLength({min:6}),
], 
newUser);

export default router;
