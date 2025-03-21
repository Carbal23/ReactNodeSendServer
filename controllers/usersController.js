import User from "../models/User.js";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator"

export const newUser = async (req, res) => {

  const validation = validationResult(req);
    if(!validation.isEmpty()){
        return res.status(400).json({errores: validation.array()})
    }

    const { email, password } = req.body;
    
  try {
  
    let userExistingByEmail = await User.findOne({ email });

    if (userExistingByEmail) {
      return res.status(400).json({ msg: "El usuario ya esta registrado" });
    }

    const newUser = new User(req.body);

    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);

    await newUser.save();

    return res.json({ msg: "Usuario creado correctamente" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Hubo un error" });
  }
};


