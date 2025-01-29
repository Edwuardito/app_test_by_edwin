import express from "express";
import {
  getUsers,
  getUserById,
  postUser,
  deleteUserById,
  postLogin,
  updateUser,
} from "../services/users-service.js";

const router = express.Router();

// Cambiar la ruta de "/users" a "/"
router.get("/", getUsers);
router.get("/:id", getUserById);
router.post("/", postUser);
router.delete("/:id", deleteUserById);
router.post("/login", postLogin);
router.put("/:id", updateUser);

export default router;
