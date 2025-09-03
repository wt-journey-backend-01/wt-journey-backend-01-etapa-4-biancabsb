import casosRepository from "../repositories/casosRepository.js";
import agentesRepository from "../repositories/agentesRepository.js";

class APIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

// ✅ valida ID genérico
const validateId = (id, fieldName, next) => {
    if (isNaN(Number(id)) || Number(id) <= 0) {
        next(new APIError(`ID inválido para ${fieldName}`, 400));
        return false;
    }
    return true;
};

// ✅ valida campos obrigatórios de string
const validateRequiredField = (value, fieldName, next) => {
    if (!value || typeof value !== "string" || value.trim() === "") {
        next(new APIError(`${fieldName} é obrigatório`, 400));
        return false;
    }
    return true;
};

// ✅ valida status
const validateStatus = (status, next) => {
    if (!["aberto", "solucionado"].includes(status)) {
        next(new APIError("Status inválido", 400));
        return false;
    }
    return true;
};

const getAllCasos = async (req, res, next) => {
    try {
        const casos = await casosRepository.readAll();
        res.status(200).json(casos);
    } catch (error) {
        next(error);
    }
};

const getCasoById = async (req, res, next) => {
    const { id } = req.params;
    if (!validateId(id, "caso", next)) return;

    try {
        const caso = await casosRepository.read(Number(id));
        if (!caso) {
            next(new APIError("Caso não encontrado", 404));
            return;
        }
        res.status(200).json(caso);
    } catch (error) {
        next(error);
    }
};

const createCaso = async (req, res, next) => {
    try {
        const { titulo, descricao, status, agentes_id, ...rest } = req.body;

        if (!validateRequiredField(titulo, "Título", next)) return;
        if (!validateRequiredField(descricao, "Descrição", next)) return;
        if (!status || !validateStatus(status, next)) return;
        if (!validateId(agentes_id, "agente", next)) return;

        if (Object.keys(rest).length > 0) {
            next(
                new APIError("Campo(s) inválido(s): " + Object.keys(rest).join(", "), 400)
            );
            return;
        }

        const agente = await agentesRepository.read(Number(agentes_id));
        if (!agente) {
            next(new APIError("Agente não encontrado para o caso", 404));
            return;
        }

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
    const { id } = req.params;
    if (!validateId(id, "caso", next)) return;

    try {
        const { titulo, descricao, status, agentes_id, ...rest } = req.body;

        if (!validateRequiredField(titulo, "Título", next)) return;
        if (!validateRequiredField(descricao, "Descrição", next)) return;
        if (!status || !validateStatus(status, next)) return;
        if (!validateId(agentes_id, "agente", next)) return;

        if (rest.id !== undefined) {
            next(new APIError("Não é permitido alterar o ID do caso", 400));
            return;
        }
        if (Object.keys(rest).length > 0) {
            next(
                new APIError("Campo(s) inválido(s): " + Object.keys(rest).join(", "), 400)
            );
            return;
        }

        const agente = await agentesRepository.read(Number(agentes_id));
        if (!agente) {
            next(new APIError("Agente não encontrado para o caso", 404));
            return;
        }

        const casoAtualizado = await casosRepository.update(Number(id), {
            titulo,
            descricao,
            status,
            agentes_id: Number(agentes_id),
        });

        if (!casoAtualizado) {
            next(new APIError("Caso não encontrado", 404));
            return;
        }

        res.status(200).json(casoAtualizado);
    } catch (error) {
        next(error);
    }
};

const updateCasoPartial = async (req, res, next) => {
    const { id } = req.params;
    if (!validateId(id, "caso", next)) return;

    const { titulo, descricao, status, agentes_id, ...rest } = req.body;

    try {
        const fieldsToUpdate = {};

        if (titulo !== undefined) {
            if (!validateRequiredField(titulo, "Título", next)) return;
            fieldsToUpdate.titulo = titulo;
        }
        if (descricao !== undefined) {
            if (!validateRequiredField(descricao, "Descrição", next)) return;
            fieldsToUpdate.descricao = descricao;
        }
        if (status !== undefined) {
            if (!validateStatus(status, next)) return;
            fieldsToUpdate.status = status;
        }
        if (agentes_id !== undefined) {
            if (!validateId(agentes_id, "agente", next)) return;
            const agente = await agentesRepository.read(Number(agentes_id));
            if (!agente) {
                next(new APIError("Agente não encontrado para o caso", 404));
                return;
            }
            fieldsToUpdate.agentes_id = Number(agentes_id);
        }
        if (rest.id !== undefined) {
            next(new APIError("Não é permitido alterar o ID do caso", 400));
            return;
        }
        if (Object.keys(rest).length > 0) {
            next(
                new APIError("Campo(s) inválido(s): " + Object.keys(rest).join(", "), 400)
            );
            return;
        }

        const casoAtualizado = await casosRepository.update(Number(id), fieldsToUpdate);
        if (!casoAtualizado) {
            next(new APIError("Caso não encontrado", 404));
            return;
        }

        res.status(200).json(casoAtualizado);
    } catch (error) {
        next(error);
    }
};

const deleteCaso = async (req, res, next) => {
    const { id } = req.params;
    if (!validateId(id, "caso", next)) return;

    try {
        const resultado = await casosRepository.remove(Number(id));
        if (!resultado) {
            next(new APIError("Caso não encontrado", 404));
            return;
        }
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
