import agentesRepository from "../repositories/agentesRepository.js";

class APIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// =================== Validações ===================

// Valida ID
const validateId = (id, next) => {
    if (isNaN(Number(id)) || Number(id) <= 0) {
        next(new APIError("ID inválido", 400));
        return false;
    }
    return true;
};

// Valida nome (não vazio, só letras e espaços)
const validateNome = (nome, next) => {
    if (!nome || typeof nome !== "string" || nome.trim() === "") {
        next(new APIError("Nome é obrigatório", 400));
        return false;
    }
    if (!/^[A-Za-zÀ-ÿ\s]+$/.test(nome)) {
        next(new APIError("Nome deve conter apenas letras e espaços", 400));
        return false;
    }
    return true;
};

// Valida cargo (não vazio)
const validateCargo = (cargo, next) => {
    if (!cargo || typeof cargo !== "string" || cargo.trim() === "") {
        next(new APIError("Cargo é obrigatório", 400));
        return false;
    }
    return true;
};

// Valida data (YYYY-MM-DD, não futura, data real)
const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const [year, month, day] = dateString.split("-").map(Number);

    if (month < 1 || month > 12) return false;
    if (day < 1 || day > 31) return false;

    const daysInMonth = new Date(year, month, 0).getDate();
    if (day > daysInMonth) return false;

    const date = new Date(year, month - 1, day);

    // Zerar horas de hoje para comparação por dia
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (date > now) return false;

    return true;
};

// =================== Controllers ===================

const getAllAgentes = async (req, res, next) => {
    try {
        const agentes = await agentesRepository.readAll();
        res.status(200).json(agentes);
    } catch (error) {
        next(error);
    }
};

const getAgenteById = async (req, res, next) => {
    const { id } = req.params;
    if (!validateId(id, next)) return;

    try {
        const agente = await agentesRepository.read(Number(id));
        if (!agente) {
            next(new APIError("Agente não encontrado", 404));
            return;
        }
        res.status(200).json(agente);
    } catch (error) {
        next(error);
    }
};

const createAgente = async (req, res, next) => {
    try {
        const { nome, cargo, dataDeIncorporacao } = req.body;

        if (!validateNome(nome, next)) return;
        if (!validateCargo(cargo, next)) return;
        if (!dataDeIncorporacao || typeof dataDeIncorporacao !== "string" || !isValidDate(dataDeIncorporacao)) {
            next(
                new APIError(
                    "Data de incorporação inválida. Use formato YYYY-MM-DD e não pode ser futura",
                    400
                )
            );
            return;
        }

        const novoAgente = await agentesRepository.create({
            nome,
            cargo,
            dataDeIncorporacao,
        });

        res.status(201).json(novoAgente);
    } catch (error) {
        next(error);
    }
};

const updateAgente = async (req, res, next) => {
    const { id } = req.params;
    if (!validateId(id, next)) return;

    try {
        // 🔹 Impede alteração de ID
        if ("id" in req.body) {
            next(new APIError("Não é permitido alterar o ID do agente", 400));
            return;
        }

        const { nome, cargo, dataDeIncorporacao } = req.body;

        if (!validateNome(nome, next)) return;
        if (!validateCargo(cargo, next)) return;
        if (!dataDeIncorporacao || typeof dataDeIncorporacao !== "string" || !isValidDate(dataDeIncorporacao)) {
            next(
                new APIError(
                    "Data de incorporação inválida. Use formato YYYY-MM-DD e não pode ser futura",
                    400
                )
            );
            return;
        }

        const agenteAtualizado = await agentesRepository.update(Number(id), {
            nome,
            cargo,
            dataDeIncorporacao,
        });

        if (!agenteAtualizado) {
            next(new APIError("Agente não encontrado", 404));
            return;
        }

        res.status(200).json(agenteAtualizado);
    } catch (error) {
        next(error);
    }
};

const updateAgentePartial = async (req, res, next) => {
    const { id } = req.params;
    if (!validateId(id, next)) return;

    // 🔹 Impede alteração de ID
    if ("id" in req.body) {
        next(new APIError("Não é permitido alterar o ID do agente", 400));
        return;
    }

    const { nome, cargo, dataDeIncorporacao, ...rest } = req.body;

    try {
        if (Object.keys(rest).length > 0) {
            next(
                new APIError(
                    "Campo(s) inválido(s): " + Object.keys(rest).join(", "),
                    400
                )
            );
            return;
        }

        const fieldsToUpdate = {};

        if (nome !== undefined) {
            if (!validateNome(nome, next)) return;
            fieldsToUpdate.nome = nome;
        }
        if (cargo !== undefined) {
            if (!validateCargo(cargo, next)) return;
            fieldsToUpdate.cargo = cargo;
        }
        if (dataDeIncorporacao !== undefined) {
            if (!isValidDate(dataDeIncorporacao)) {
                next(
                    new APIError(
                        "Data de incorporação inválida. Use formato YYYY-MM-DD e não pode ser futura",
                        400
                    )
                );
                return;
            }
            fieldsToUpdate.dataDeIncorporacao = dataDeIncorporacao;
        }

        const agenteAtualizado = await agentesRepository.update(
            Number(id),
            fieldsToUpdate
        );

        if (!agenteAtualizado) {
            next(new APIError("Agente não encontrado", 404));
            return;
        }

        res.status(200).json(agenteAtualizado);
    } catch (error) {
        next(error);
    }
};

const deleteAgente = async (req, res, next) => {
    const { id } = req.params;
    if (!validateId(id, next)) return;

    try {
        const resultado = await agentesRepository.remove(Number(id));
        if (!resultado) {
            next(new APIError("Agente não encontrado", 404));
            return;
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export default {
    getAllAgentes,
    getAgenteById,
    createAgente,
    updateAgente,
    updateAgentePartial,
    deleteAgente,
};
