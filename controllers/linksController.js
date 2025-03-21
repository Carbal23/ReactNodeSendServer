import Link from "../models/Link.js";
import shortid from "shortid";
import bcrypt from "bcrypt";
import { validationResult } from "express-validator";

export const newLink = async (req, res) => {
  const validation = validationResult(req);

  if (!validation.isEmpty()) {
    return res.status(400).json({ errores: validation.array() });
  }

  const { original_name, name } = req.body;

  const link = new Link();
  link.url = shortid.generate();
  link.name = name;
  link.original_name = original_name;

  if (req.user) {
    console.log("usuario autenticado", req.user);
    const { downloads, password } = req.body;

    const salt = await bcrypt.genSalt(10);

    password
      ? (link.password = await bcrypt.hash(password, salt))
      : (link.password = null);

    downloads ? (link.downloads = downloads) : (link.downloads = 1);

    link.author = req.user._id;
  }

  try {
    await link.save();
    return res.json({ msg: `${link.url}` });
  } catch (error) {
    console.log(error);
  }
};

export const getLinks = async (req, res) => {
  try {
    const links = await Link.find({}).select("url -_id");
    res.json({ links });
  } catch (error) {
    console.log(error);
  }
};

export const hasPassword = async (req, res, next) => {
  const { url } = req.params;
  const link = await Link.findOne({ url });

  if (!link) {
    return res.status(404).json({ msg: "El enlace no existe" });
  }

  if (link.password) {
    return res.json({ password: true, link: link.url });
  }

  next();
};

export const verifyPassword = async (req, res, next) => {
  const { password } = req.body;
  const { url } = req.params;
  const link = await Link.findOne({
    url,
  });

  if(bcrypt.compareSync(password, link.password)) {
    next();
  } else {
    return res.status(401).json({ msg: "Contraseña incorrecta" });
  }
};

export const getLink = async (req, res, next) => {
  const { url } = req.params;
  const link = await Link.findOne({ url });

  if (!link) {
    return res.status(404).json({ msg: "El enlace no existe" });
  }

  res.json({ file: link.name });

  next();
};
