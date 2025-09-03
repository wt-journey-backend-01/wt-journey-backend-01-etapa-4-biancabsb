import usuariosRepository from "../repositories/usuariosRepository.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

const login = async (req, res) => {
  try {
    const { email, senha } = req.body;

    if (!email || !senha) {
      return res.status(400).json({ message: "Email e senha são obrigatórios", field: "email/senha" });
    }

    const user = await usuariosRepository.findByEmail(email);
    if (!user) {
      return res.status(401).json({ message: "Credenciais inválidas", field: "email" });
    }

    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Credenciais inválidas", field: "senha" });
    }

    const token = jwt.sign(
      { id: user.id, name: user.nome, email: user.email }, // use "name"
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    res.status(200).json({ access_token: token });
  } catch (error) {
    res.status(500).json({ message: "Erro interno no servidor", field: "server" });
  }
};

const signup = async (req, res) => {
  try {
    const { nome, email, senha, ...extraFields } = req.body;

    if (Object.keys(extraFields).length > 0) {
      return res.status(400).json({ message: "Campos extras não permitidos", field: "extra" });
    }

    if (!nome || typeof nome !== "string" || nome.trim() === "") {
      return res.status(400).json({ message: "Nome é obrigatório", field: "nome" });
    }
    if (!email || typeof email !== "string" || email.trim() === "") {
      return res.status(400).json({ message: "Email é obrigatório", field: "email" });
    }
    if (!senha || typeof senha !== "string") {
      return res.status(400).json({ message: "Senha é obrigatória", field: "senha" });
    }
    if (!passwordRegex.test(senha)) {
      return res.status(400).json({
        message: "Senha deve ter no mínimo 8 caracteres, incluindo letras maiúsculas, minúsculas, números e caracteres especiais",
        field: "senha"
      });
    }

    const user = await usuariosRepository.findByEmail(email);
    if (user) {
      return res.status(400).json({ message: "Email já está em uso", field: "email" });
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
    res.status(500).json({ message: "Falha ao criar usuário", field: "server" });
  }
};

const logout = (req, res) => {
  try {
    res.status(200).json({ message: "Logout realizado com sucesso" });
  } catch (error) {
    res.status(500).json({ message: "Falha ao realizar logout", field: "server" });
  }
};

const deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    const user = await usuariosRepository.findById(id);
    if (!user) {
      return res.status(404).json({ message: "Usuário não encontrado", field: "id" });
    }

    await usuariosRepository.remove(id);
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: "Falha ao deletar usuário", field: "server" });
  }
};

export default {
  login,
  signup,
  logout,
  deleteUser,
};
