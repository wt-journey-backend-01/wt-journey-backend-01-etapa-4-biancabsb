import usuariosRepository from "../repositories/usuariosRepository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import ApiError from "../utils/errorHandler.js";

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await usuariosRepository.findByEmail(email);
    if (!user) {
      return next(
        new ApiError("User not found!", 404, {
          email: "user not found",
        })
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
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
      message: "Login successful",
      token,
    });
  } catch (error) {
    next(ApiError.internal("Internal server error", 500, error.message));
  }
};

const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const user = await usuariosRepository.findByEmail(email);
    if (user) {
      return next(
        new ApiError("User already exists", 400, {
          email: "Email is already in use",
        })
      );
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS, 10));
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await usuariosRepository.create({
      name,
      email,
      password: hashedPassword,
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

    await usuariosRepository.delete(id);
    res.status(204).send();
  } catch (error) {
    next(ApiError.internal("User deletion failed", 500, error.message));
  }
};
module.exports = {
  login,
  signup,
  logout,
  deleteUser,
};
