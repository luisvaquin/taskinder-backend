import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/auth.routes.js";
import taskRoutes from "./routes/task.routes.js";

const app = express();

const allowedOrigins = ["http://localhost:5173", "https://taskinn.netlify.app"];

// Middleware de CORS
app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

// Middleware para configurar manualmente CORS si Vercel ignora los headers
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.setHeader("Access-Control-Allow-Origin", origin);
    res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, DELETE, OPTIONS"
    );
    res.setHeader(
      "Access-Control-Allow-Headers",
      "Content-Type, Authorization"
    );
    res.setHeader("Access-Control-Allow-Credentials", "true");
  }

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

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

export default app;
