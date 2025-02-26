import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

// Define las URLs permitidas para CORS
const allowedOrigins = [
  "http://localhost:5173", // Para el entorno local
  "https://taskinn.netlify.app", // URL principal de producción
];

// Middleware de CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true); // Permite la solicitud
      } else {
        callback(new Error("Not allowed by CORS")); // Bloquea la solicitud
      }
    },
    credentials: true, // Permite el uso de cookies
  })
);

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

// Rutas
app.use("/api", taskRoutes);
app.use("/api", authRoutes);

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
  res.status(404).json({ message: "ROUTE NOT FOUND" });
});

// Middleware de manejo de errores para CORS y otros errores
app.use((err, req, res, next) => {
  if (err.message === "Not allowed by CORS") {
    return res.status(403).json({ error: "CORS error: Not allowed origin" });
  }
  // Si no es un error de CORS, procesamos el error genérico
  res.status(500).json({ error: "Internal server error" });
});

export default app;
