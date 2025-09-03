import agentesRepository from "../repositories/agentesRepository.js";

class APIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// ✅ valida ID
const validateId = (id, next) => {
    if (isNaN(Number(id)) || Number(id) <= 0) {
        next(new APIError("ID inválido", 400));
        return false;
    }
    return true;
};

// ✅ valida nome (não vazio, só letras e espaços)
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

// ✅ valida cargo (não vazio)
const validateCargo = (cargo, next) => {
    if (!cargo || typeof cargo !== "string" || cargo.trim() === "") {
        next(new APIError("Cargo é obrigatório", 400));
        return false;
    }
    return true;
};

// ✅ valida data (YYYY-MM-DD, não futuro)
const isValidDate = (dateString) => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    if (!regex.test(dateString)) return false;

    const date = new Date(dateString + "T00:00:00");
    const now = new Date();

    const [year, month, day] = dateString.split("-").map(Number);
    if (
        date.getUTCFullYear() !== year ||
        date.getUTCMonth() + 1 !== month ||
        date.getUTCDate() !== day
    ) {
        return false;
    }

    return date <= now;
};

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
        if (!dataDeIncorporacao || !isValidDate(dataDeIncorporacao)) {
            next(new APIError("Data de incorporação inválida ou no futuro", 400));
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
        const { nome, cargo, dataDeIncorporacao, ...rest } = req.body;

        if (!validateNome(nome, next)) return;
        if (!validateCargo(cargo, next)) return;
        if (!dataDeIncorporacao || !isValidDate(dataDeIncorporacao)) {
            next(new APIError("Data de incorporação inválida ou no futuro", 400));
            return;
        }
        if (rest.id !== undefined) {
            next(new APIError("Não é permitido alterar o ID do agente", 400));
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

    const { nome, cargo, dataDeIncorporacao, ...rest } = req.body;

    try {
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
                next(new APIError("Data de incorporação inválida ou no futuro", 400));
                return;
            }
            fieldsToUpdate.dataDeIncorporacao = dataDeIncorporacao;
        }
        if (rest.id !== undefined) {
            next(new APIError("Não é permitido alterar o ID do agente", 400));
            return;
        }
        if (Object.keys(rest).length > 0) {
            next(
                new APIError(
                    "Campo(s) inválido(s): " + Object.keys(rest).join(", "),
                    400
                )
            );
            return;
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
