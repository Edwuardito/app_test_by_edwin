import sql from "mssql";
import bcrypt from "bcrypt";
import { poolPromise } from "../config/config.js";
import {
  validateEmail,
  validateParametersUser,
  validatePassword,
  validatePasswordStrength,
  validateRecordset,
  valiteId,
  validateParameter,
} from "../Validation/user-validation.js";
import {
  generateAccessToken,
  generateRefreshAccessToken,
} from "../functions/functions.js";
import { HTTP } from "../Constants/constant.js";
import { verifyToken } from "../Middleware/verifyToken.js";
//jwtk
export const getUsers = [
  verifyToken,
  async (req, res) => {
    try {
      const pool = await poolPromise;
      const result = (await pool.request().query("SELECT * FROM dbo.USUARIO"))
        .recordset;

      const usersWithoutPassword = result.map(({ Password, ...user }) => user);

      return res.status(HTTP.OK).json({
        type: HTTP.OK,
        users: usersWithoutPassword,
      });
    } catch (error) {
      return res.status(500).send({ error: error.message });
    }
  },
];
//jwtk
export const getUserById = [
  verifyToken,
  async (req, res) => {
    try {
      const { id } = req.params;

      let resultValidateId = valiteId(id);
      if (resultValidateId != null) {
        return res.status(HTTP.BAD_REQUEST).json({
          type: HTTP.BAD_REQUEST,
          error: resultValidateId,
        });
      }

      const pool = await poolPromise;

      const result = await pool
        .request()
        .input("id", sql.Int, id)
        .query("SELECT * FROM dbo.USUARIO WHERE Id = @id");

      let resultValidateRecordset = validateRecordset(result);
      if (resultValidateRecordset != null) {
        return res.status(HTTP.NOT_FOUND).json({
          type: HTTP.NOT_FOUND,
          error: resultValidateRecordset,
        });
      }

      const usersWithoutPassword = result.recordset.map(
        ({ Password, ...user }) => user
      );

      return res.status(HTTP.OK).json(usersWithoutPassword);
    } catch (error) {
      return res
        .status(HTTP.INTERNAL_SERVER_ERROR)
        .send({ error: error.message });
    }
  },
];

export const postUser = async (req, res) => {
  try {
    const { email, password, confirmPassword } = req.body;
    let resultValidateParameters = validateParametersUser(email, password);
    if (resultValidateParameters != null) {
      return res.status(HTTP.BAD_REQUEST).send({
        type: HTTP.BAD_REQUEST,
        error: resultValidateParameters,
      });
    }

    let resultValidateEmail = validateEmail(email);
    if (resultValidateEmail != null) {
      return res.status(HTTP.BAD_REQUEST).send({
        type: HTTP.BAD_REQUEST,
        error: resultValidateEmail,
      });
    }

    let resultValidatePasswordStrength = validatePasswordStrength(password);
    if (resultValidatePasswordStrength != null) {
      return res.status(HTTP.BAD_REQUEST).send({
        type: HTTP.BAD_REQUEST,
        error: resultValidatePasswordStrength,
      });
    }

    let resultValidatePassword = validatePassword(password, confirmPassword);
    if (resultValidatePassword != null) {
      return res.status(HTTP.BAD_REQUEST).send({
        type: HTTP.BAD_REQUEST,
        error: resultValidatePassword,
      });
    }

    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const pool = await poolPromise;
    await pool
      .request()
      .input("email", sql.VarChar, email)
      .input("hashedPassword", sql.VarChar, hashedPassword)
      .query(
        `INSERT INTO dbo.USUARIO (Email, Password) VALUES (@email, @hashedPassword)`
      );

    return res.status(HTTP.CREATED).send({
      type: HTTP.CREATED,
      message: "Usuario creado exitosamente",
    });
  } catch (error) {
    return res.status(HTTP.INTERNAL_SERVER_ERROR).send({
      type: HTTP.INTERNAL_SERVER_ERROR,
      error: "Internal Server Error",
    });
  }
};
//jwtk
export const deleteUserById = [
  verifyToken,
  async (req, res) => {
    try {
      const { id } = req.params;

      const pool = await poolPromise;

      const result = await pool
        .request()
        .input("Id", sql.Int, id)
        .query("DELETE FROM dbo.USUARIO WHERE Id = @Id");

      if (result.rowsAffected[0] === 0)
        return res
          .status(HTTP.NOT_FOUND)
          .send({ type: HTTP.NOT_FOUND, error: "Usuario no encontrado" });

      return res
        .status(HTTP.OK)
        .send({ type: HTTP.OK, message: "Usuario eliminado con éxito" });
    } catch (error) {
      return res
        .status(HTTP.INTERNAL_SERVER_ERROR)
        .send({ type: HTTP.INTERNAL_SERVER_ERROR, error: error.message });
    }
  },
];

export const postLogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    let resultValidateParameters = validateParametersUser(email, password);
    if (resultValidateParameters != null) {
      return res.status(HTTP.BAD_REQUEST).send({
        type: HTTP.BAD_REQUEST,
        error: resultValidateParameters,
      });
    }

    const pool = await poolPromise;

    const result = await pool
      .request()
      .input("Email", sql.VarChar, email)
      .query("SELECT * FROM dbo.USUARIO WHERE Email = @Email");

    let resultValidateRecordset = validateRecordset(result);
    if (resultValidateRecordset != null) {
      res.status(HTTP.NOT_FOUND).json({
        type: HTTP.NOT_FOUND,
        error: resultValidateRecordset,
      });
    }
    const user = result.recordset[0];

    const isPasswordValid = await bcrypt.compare(password, user.Password);
    if (!isPasswordValid) {
      return res
        .status(HTTP.NOT_FOUND)
        .send({ error: "Contraseña incorrecta." });
    }

    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshAccessToken(user);

    return res.status(HTTP.OK).send({
      type: HTTP.OK,
      accessToken,
      refreshToken,
      userId: user.Id,
      userEmail: user.Email,
    });
  } catch (error) {
    return res
      .status(HTTP.INTERNAL_SERVER_ERROR)
      .send({ error: error.message });
  }
};
//jwtk
export const updateUser = [
  verifyToken,
  async (req, res) => {
    try {
      const { id } = req.params;
      const { password } = req.body;

      let resultValidateParameters = validateParameter(password);
      if (resultValidateParameters != null) {
        return res.status(HTTP.BAD_REQUEST).send({
          type: HTTP.BAD_REQUEST,
          error: resultValidateParameters,
        });
      }

      const pool = await poolPromise;
      const updates = [];

      let resultValidatePasswordStrength = validatePasswordStrength(password);
      if (resultValidatePasswordStrength != null) {
        return res.status(HTTP.BAD_REQUEST).send({
          type: HTTP.BAD_REQUEST,
          error: resultValidatePasswordStrength,
        });
      }
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);
      updates.push(`Password = @Password`);
      req.body.password = hashedPassword;

      if (updates.length === 0)
        return res.status(400).send({ error: "Nada que actualizar." });

      await pool
        .request()
        .input("Password", sql.VarChar, req.body.password || null)
        .input("Id", sql.Int, id)
        .query(`UPDATE dbo.USUARIO SET ${updates.join(", ")} WHERE Id = @Id`);

      return res.status(HTTP.CREATED).send({
        tipe: HTTP.CREATED,
        message: "Usuario actualizado con éxito.",
      });
    } catch (error) {
      return res
        .status(HTTP.INTERNAL_SERVER_ERROR)
        .send({ error: error.message });
    }
  },
];
