import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
import jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

// 🔹 REGISTRO
export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Validar si el correo ya está registrado
    const userFound = await User.findOne({ email });
    if (userFound)
      return res.status(400).json(["El correo ya está registrado"]);

    // Encriptar la contraseña
    const passwordHash = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: passwordHash });
    const userSaved = await newUser.save();

    // Generar token
    const token = await createAccessToken({ id: userSaved._id });

    // Configurar cookie de sesión segura
    res.cookie("token", token, {
      httpOnly: true, // Evita que JS en el frontend acceda a la cookie
      secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
      sameSite: "Strict", // Previene ataques CSRF
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    // Enviar datos del usuario
    return res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

// 🔹 LOGIN
export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    // Buscar usuario en la base de datos
    const userFound = await User.findOne({ email });
    if (!userFound)
      return res.status(400).json({ message: "No se encontró el email" });

    // Comparar contraseña
    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: "Contraseña incorrecta" });

    // Generar token
    const token = await createAccessToken({ id: userFound._id });

    // Configurar cookie con el token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "Strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 días
    });

    // Enviar datos del usuario
    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error en el servidor" });
  }
};

// 🔹 CERRAR SESIÓN
export const logout = (req, res) => {
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "Strict",
    expires: new Date(0), // Expira inmediatamente
  });
  return res.sendStatus(200);
};

// 🔹 VERIFICAR TOKEN
export const verifyToken = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: "No autorizado" });

    jwt.verify(token, TOKEN_SECRET, async (error, decoded) => {
      if (error) return res.status(403).json({ message: "Token inválido" });

      const userFound = await User.findById(decoded.id);
      if (!userFound)
        return res.status(404).json({ message: "Usuario no encontrado" });

      return res.json({
        id: userFound._id,
        username: userFound.username,
        email: userFound.email,
      });
    });
  } catch (e) {
    return res.status(500).json({ message: "Error al verificar el token" });
  }
};

export const profile = async (req, res) => {
  const userFound = await User.findById(req.user.id);

  if (!userFound)
    return res.status(400).json({
      message: "usuario no encontrado",
    });

  return res.json({
    id: userFound._id,
    username: userFound.username,
    email: userFound.email,
    createdAt: userFound.createdAt,
    updatedAt: userFound.updatedAt,
  });
};
