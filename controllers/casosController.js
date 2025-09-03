import casosRepository from "../repositories/casosRepository.js";
import agentesRepository from "../repositories/agentesRepository.js";

class APIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// Valida ID genérico
const validateId = (id, fieldName) => {
    if (isNaN(Number(id)) || Number(id) <= 0) {
        throw new APIError(`ID inválido para ${fieldName}`, 400);
    }
};

// Valida campos obrigatórios de string
const validateRequiredField = (value, fieldName) => {
    if (!value || typeof value !== "string" || value.trim() === "") {
        throw new APIError(`${fieldName} é obrigatório`, 400);
    }
};

// Valida status
const validateStatus = (status) => {
    if (!["aberto", "solucionado"].includes(status)) {
        throw new APIError("Status inválido", 400);
    }
};

// ======================= Controllers =======================

const getAllCasos = async (req, res, next) => {
    try {
        const casos = await casosRepository.readAll();
        res.status(200).json(casos);
    } catch (error) {
        next(error);
    }
};

const getCasoById = async (req, res, next) => {
    try {
        const { id } = req.params;
        validateId(id, "caso");

        const caso = await casosRepository.read(Number(id));
        if (!caso) throw new APIError("Caso não encontrado", 404);

        res.status(200).json(caso);
    } catch (error) {
        next(error);
    }
};

const createCaso = async (req, res, next) => {
    try {
        const { titulo, descricao, status, agentes_id, ...rest } = req.body;

        validateRequiredField(titulo, "Título");
        validateRequiredField(descricao, "Descrição");
        validateStatus(status);
        validateId(agentes_id, "agente");

        if (Object.keys(rest).length > 0) {
            throw new APIError(
                "Campo(s) inválido(s): " + Object.keys(rest).join(", "),
                400
            );
        }

        const agente = await agentesRepository.read(Number(agentes_id));
        if (!agente) throw new APIError("Agente não encontrado para o caso", 404);

        const novoCaso = await casosRepository.create({
            titulo,
            descricao,
            status,
            agentes_id: Number(agentes_id),
        });

        res.status(201).json(novoCaso);
    } catch (error) {
        next(error);
    }
};

const updateCaso = async (req, res, next) => {
    try {
        const { id } = req.params;
        validateId(id, "caso");

        const { titulo, descricao, status, agentes_id, ...rest } = req.body;

        validateRequiredField(titulo, "Título");
        validateRequiredField(descricao, "Descrição");
        validateStatus(status);
        validateId(agentes_id, "agente");

        if ("id" in req.body) throw new APIError("Não é permitido alterar o ID do caso", 400);
        if (Object.keys(rest).length > 0) {
            throw new APIError("Campo(s) inválido(s): " + Object.keys(rest).join(", "), 400);
        }

        const agente = await agentesRepository.read(Number(agentes_id));
        if (!agente) throw new APIError("Agente não encontrado para o caso", 404);

        const casoAtualizado = await casosRepository.update(Number(id), {
            titulo,
            descricao,
            status,
            agentes_id: Number(agentes_id),
        });

        if (!casoAtualizado) throw new APIError("Caso não encontrado", 404);

        res.status(200).json(casoAtualizado);
    } catch (error) {
        next(error);
    }
};

const updateCasoPartial = async (req, res, next) => {
    try {
        const { id } = req.params;
        validateId(id, "caso");

        const { titulo, descricao, status, agentes_id, ...rest } = req.body;
        const fieldsToUpdate = {};

        if ("id" in req.body) throw new APIError("Não é permitido alterar o ID do caso", 400);
        if (Object.keys(rest).length > 0) {
            throw new APIError("Campo(s) inválido(s): " + Object.keys(rest).join(", "), 400);
        }

        if (titulo !== undefined) {
            validateRequiredField(titulo, "Título");
            fieldsToUpdate.titulo = titulo;
        }
        if (descricao !== undefined) {
            validateRequiredField(descricao, "Descrição");
            fieldsToUpdate.descricao = descricao;
        }
        if (status !== undefined) {
            validateStatus(status);
            fieldsToUpdate.status = status;
        }
        if (agentes_id !== undefined) {
            validateId(agentes_id, "agente");
            const agente = await agentesRepository.read(Number(agentes_id));
            if (!agente) throw new APIError("Agente não encontrado para o caso", 404);
            fieldsToUpdate.agentes_id = Number(agentes_id);
        }

        const casoAtualizado = await casosRepository.update(Number(id), fieldsToUpdate);
        if (!casoAtualizado) throw new APIError("Caso não encontrado", 404);

        res.status(200).json(casoAtualizado);
    } catch (error) {
        next(error);
    }
};

const deleteCaso = async (req, res, next) => {
    try {
        const { id } = req.params;
        validateId(id, "caso");

        const resultado = await casosRepository.remove(Number(id));
        if (!resultado) throw new APIError("Caso não encontrado", 404);

        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

export default {
    getAllCasos,
    getCasoById,
    createCaso,
    updateCaso,
    updateCasoPartial,
    deleteCaso,
};
