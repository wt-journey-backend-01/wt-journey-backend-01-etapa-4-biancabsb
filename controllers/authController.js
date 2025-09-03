import usuariosRepository from "../repositories/usuariosRepository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

class APIError extends Error {
  constructor(message, statusCode, field = null) {
    super(message);
    this.statusCode = statusCode;
    this.field = field;
  }
}

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const login = async (req, res, next) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      throw new APIError("Email e senha são obrigatórios", 400, "email/senha");
    }

    const user = await usuariosRepository.findByEmail(email);
    if (!user) {
      throw new APIError("Credenciais inválidas", 401, "email");
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      throw new APIError("Credenciais inválidas", 401, "senha");
    }

    const token = jwt.sign(
      { id: user.id, name: user.nome, email: user.email },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1d" }
    );

    res.status(200).json({ access_token: token });
  } catch (error) {
    next(error);
  }
};

const signup = async (req, res, next) => {
  try {
    const { nome, email, senha, ...extraFields } = req.body;

    if (Object.keys(extraFields).length > 0) {
      throw new APIError("Campos extras não permitidos", 400, "extra");
    }
    if (!nome || typeof nome !== "string" || nome.trim() === "") {
      throw new APIError("Nome é obrigatório", 400, "nome");
    }
    if (!email || typeof email !== "string" || email.trim() === "") {
      throw new APIError("Email é obrigatório", 400, "email");
    }
    if (!senha || typeof senha !== "string") {
      throw new APIError("Senha é obrigatória", 400, "senha");
    }
    if (!passwordRegex.test(senha)) {
      throw new APIError(
        "Senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais",
        400,
        "senha"
      );
    }

    const user = await usuariosRepository.findByEmail(email);
    if (user) {
      throw new APIError("Email já está em uso", 400, "email");
    }

    const salt = await bcrypt.genSalt(parseInt(process.env.SALT_ROUNDS, 10) || 10);
    const hashedPassword = await bcrypt.hash(senha, salt);

    const newUser = await usuariosRepository.create({
      nome,
      email,
      senha: hashedPassword,
    });

    res.status(201).json({
      message: "Usuário criado com sucesso",
      user: { id: newUser.id, name: newUser.nome, email: newUser.email }
    });
  } catch (error) {
    console.error("ERRO signup:", error); // 👈 log no terminal
    next(error);
  }
};

const logout = (req, res) => {
  res.status(200).json({ message: "Logout realizado com sucesso" });
};

const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;

    const user = await usuariosRepository.findById(id);
    if (!user) {
      throw new APIError("Usuário não encontrado", 404, "id");
    }

    await usuariosRepository.remove(id);
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};

export default {
  login,
  signup,
  logout,
  deleteUser,
};
