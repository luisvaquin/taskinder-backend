import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  const { username, email, password } = req.body;
  try {
    // Validación de campos
    const userFound = await User.findOne({ email });
    if (userFound)
      return res.status(400).json(["El correo ya está registrado"]);

    // Encriptación de password
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
    });

    // Guardar en la base de datos
    const userSaved = await newUser.save();

    // Validación de token
    const token = await createAccessToken({ id: userSaved._id });

    // Enviar cookie y respuesta al cliente
    res.cookie("token", token);
    return res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Error al registrar el usuario" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    console.time("findUser");
    const userFound = await User.findOne({ email }); // Buscar correo en db
    console.timeEnd("findUser");

    if (!userFound)
      return res.status(400).json({
        message: "No se encontró el email",
      });

    console.time("comparePassword");
    const isMatch = await bcrypt.compare(password, userFound.password);
    console.timeEnd("comparePassword");

    if (!isMatch)
      return res.status(400).json({
        message: "Contraseña incorrecta",
      });

    console.time("createToken");
    const token = await createAccessToken({ id: userFound._id }); // Validación de token
    console.timeEnd("createToken");

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Solo enviar cookies en HTTPS en producción
      sameSite: "strict",
    });

    res.json({
      message: "Login exitoso",
    });
  } catch (e) {
    console.error("Error en login:", e);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
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

//🔹 SYNA7DB5:00 06CB:CD41 Touchpad
