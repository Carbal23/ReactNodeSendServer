import User from "../models/User.js";
import bcrypt from "bcrypt";
import { configDotenv } from "dotenv";
import { validationResult } from "express-validator";
import jwt from "jsonwebtoken";

configDotenv({ path: "variables.env" });

export const authenticateUser = async (req, res) => {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(400).json({ errores: validation.array() });
  }

  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email }).select("-__v");

    if (!user) {
      return res.status(401).json({ msg: "Usuario no existe" });
    }

    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(401).json({ msg: "Contraseña incorrecta" });
    }

    const token = jwt.sign(
      {
        _id: user._id,
        name: user.name,
        email: user.email,
      },
      process.env.SECRETA,
      {
        expiresIn: "8h",
      }
    );

    const { password: _, ...userWithoutPassword } = user.toObject();

    return res.json({ token, user: userWithoutPassword });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Hubo un error" });
  }
};

export const getAuthenticatedUser = async (req, res) => {
  const { email } = req.user;

  if (!email) {
    return;
  }

  try {
    const user = await User.findOne({ email }).select("-__v");

    if (!user) {
      return res.status(401).json({ msg: "Usuario no existe" });
    }
    const { password: _, ...userWithoutPassword } = user.toObject();

    return res.json({ user: userWithoutPassword });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Hubo un error" });
  }
};
