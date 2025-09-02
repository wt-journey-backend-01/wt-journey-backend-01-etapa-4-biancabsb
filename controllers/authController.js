import usuariosRepository from "../repositories/usuariosRepository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../utils/errorHandler.js";

const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;
    const user = await usuariosRepository.findByEmail(email);
    if (!user) {
      return next(
        new ApiError("User not found!", 404, {
          email: "user not found",
        })
      );
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return next(
        new ApiError("Invalid credentials", 401, {
          email: "Invalid password",
        })
      );
    }

    const token = jwt.sign(
      { id: user.id, name: user.name, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({
      access_token: token,
    });
  } catch (error) {
    next(ApiError.internal("Internal server error", 500, error.message));
  }
};

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const signup = async (req, res, next) => {
  try {
    const { nome, email, senha, ...extraFields } = req.body;

    // Verificar campos extras
    if (Object.keys(extraFields).length > 0) {
      return next(new ApiError("Campos extras não permitidos", 400));
    }

    if (!nome || typeof nome !== "string" || nome.trim() === "") {
      return next(new ApiError("Nome é obrigatório", 400));
    }
    if (!email || typeof email !== "string" || email.trim() === "") {
      return next(new ApiError("Email é obrigatório", 400));
    }
    if (!senha || typeof senha !== "string") {
      return next(new ApiError("Senha é obrigatória", 400));
    }
    if (!passwordRegex.test(senha)) {
      return next(
        new ApiError(
          "Senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais",
          400
        )
      );
    }

    const user = await usuariosRepository.findByEmail(email);
    if (user) {
      return next(
        new ApiError("User already exists", 400, {
          email: "Email is already in use",
        })
      );
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS, 10) || 10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const newUser = await usuariosRepository.create({
      nome,
      email,
      senha: hashedPassword,
    });

    res.status(201).json({
      message: "User created successfully",
      user: newUser,
    });
  } catch (error) {
    next(ApiError.internal("User creation failed", 500, error.message));
  }
};

const logout = (req, res, next) => {
  try {
    // Se não houver refresh token/blacklist, basta retornar OK
    res.status(200).json({
      message: "Logout successful",
    });
  } catch (error) {
    next(ApiError.internal("Logout failed", 500, error.message));
  }
};
const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await usuariosRepository.findById(id);
    if (!user) {
      return next(
        new ApiError("User not found", 404, {
          id: "User not found",
        })
      );
    }

    await usuariosRepository.remove(id);
    res.status(204).send();
  } catch (error) {
    next(ApiError.internal("User deletion failed", 500, error.message));
  }
};

export default {
  login,
  signup,
  logout,
  deleteUser,
};

