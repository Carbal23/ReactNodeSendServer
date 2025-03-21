import express from "express";
import dbConecction from "./config/db.js";
import cors from "cors";
import userRouter from "./routes/users.js";
import authRouter from "./routes/auth.js";
import linkRouter from "./routes/links.js";
import fileRouter from "./routes/files.js";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

dbConecction();

const corsOptions = {
  origin: process.env.FRONTEND_URL,
  credentials: true,
}
app.use( cors(corsOptions));

app.use(express.static("uploads"));

app.use('/api/users', userRouter);
app.use('/api/auth', authRouter);
app.use('/api/links', linkRouter);
app.use('/api/files', fileRouter)

const port = process.env.PORT || 4000;

app.listen(port, "0.0.0.0", () => {
  console.log(`El servidor esta funcionando en el puerto ${port}`);
});
