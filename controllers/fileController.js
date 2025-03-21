import multer from "multer";
import shortid from "shortid";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import Link from "../models/Link.js";

const __filename = fileURLToPath(import.meta.url); // Obtén el nombre del archivo actual
const __dirname = path.dirname(__filename); // Obtén el directorio del archivo actual

const multerConfig = (userAuth) => {
  const config = {
    limits: { fileSize: userAuth ? 1024 * 1024 * 10 : 1024 * 1024 },
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../uploads")); // Ruta donde se guardarán los archivos
      },
      filename: (req, file, cb) => {
        const extension = file.originalname.substring(
          file.originalname.lastIndexOf("."),
          file.originalname.length
        );
        cb(null, `${shortid.generate()}${extension}`);
      },
    }),
  };
  return config;
};

export const uploadFile = async (req, res, next) => {
  console.log(req.user);
  const upload = multer(multerConfig(req.user)).single("file");

  upload(req, res, async (error) => {
    if (error) {
      console.error("Error al subir archivo:", error);
      return res.status(400).json({
        msg: "Error al subir el archivo. Verifica el formato y tamaño.",
      });
    }

    if (!req.file) {
      return res.status(400).json({ msg: "No se ha enviado ningún archivo." });
    }

    console.log("Archivo subido:", req.file.filename);
    return res.json({ file: req.file.filename });
  });
};

export const deleteFile = async (req, res) => {
  const { file } = req;

  if (!file) return;

  try {
    fs.unlinkSync(path.join(__dirname, `../uploads/${file}`));
    console.log("Archivo eliminado");
    if (!res.headersSent) {
      res.json({ msg: "Archivo eliminado" });
    }
  } catch (error) {
    console.log(error);
    if (!res.headersSent) {
      res.status(500).json({ msg: "Hubo un error al eliminar el archivo" });
    }
  }
};

export const downloadFile = async (req, res, next) => {
  const { filename } = req.params;
  const link = await Link.findOne({ name: filename });
  const filePath = path.join(__dirname, `../uploads/${filename}`);

  try {
    if (fs.existsSync(filePath)) {
      // Enviar el archivo al cliente
      res.download(filePath, async (err) => {
        if (err) {
          console.log(err);
          return res.status(500).json({ msg: "Error al descargar el archivo" });
        }

        const { downloads, name } = link;

        if (downloads === 1) {
          req.file = name; 
          await Link.findByIdAndDelete(link._id);
          deleteFile(req, res)
        } else {
          link.downloads--;
          await link.save();
        }
      });
    } else {
      return res.status(404).json({ msg: "Archivo no encontrado" });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Hubo un error" });
  }
};

