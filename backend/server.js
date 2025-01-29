import express from "express";
import cors from "cors";
import morgan from "morgan";
import api from "./routes/index.js";
import dotenv from "dotenv";
dotenv.config();
const app = express();
const version = 1;
const corsOptions = {
  origin: `http://localhost:${process.env.PORT || 4000}`,
};

// Middlewares
app.use(cors(corsOptions));
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

//Rutas
app.use(`/V${version}/api`, api);

app.set("port", process.env.PORT || 4000);

//Bienvenida
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the application." });
});

// Iniciar Servidor
app.listen(app.get("port"), () => {
  console.log(`Server on port ${app.get("port")}`);
});
