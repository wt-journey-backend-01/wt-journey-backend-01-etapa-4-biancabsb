const agentesRepository = require('../repositories/agentesRepository');
class APIError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
    }
}

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
    try {
        const agente = await agentesRepository.read(id);
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
        if (!nome || !cargo || !dataDeIncorporacao) {
            next(new APIError("Todos os campos são obrigatórios", 400));
            return;
        }
        if (!isValidDate(dataDeIncorporacao)) {
            next(new APIError("Data de incorporação inválida ou no futuro", 400));
            return;
        }
        const novoAgente = await agentesRepository.create({ nome, cargo, dataDeIncorporacao });
        res.status(201).json(novoAgente);
    } catch (error) {
        next(error);
    }
};
const isValidDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    return !isNaN(date) && date <= now;
};

const updateAgente = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { nome, cargo, dataDeIncorporacao, ...rest } = req.body;
        if (!nome || !cargo || !dataDeIncorporacao) {
            next(new APIError("Todos os campos são obrigatórios", 400));
            return;
        }
        if (!isValidDate(dataDeIncorporacao)) {
            next(new APIError("Data de incorporação inválida ou no futuro", 400));
            return;

        }
        if (rest.id !== undefined) {
            next(new APIError("Não é permitido alterar o ID do agente", 400));
            return;
        }
        const agenteAtualizado = await agentesRepository.update(id, { nome, cargo, dataDeIncorporacao });
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
    const { nome, cargo, dataDeIncorporacao, ...rest } = req.body;
    try {
        const fieldsToUpdate = {};
        if (nome !== undefined) fieldsToUpdate.nome = nome;
        if (cargo !== undefined) fieldsToUpdate.cargo = cargo;
        if (dataDeIncorporacao !== undefined && !isValidDate(dataDeIncorporacao)) {
            next(new APIError("Data de incorporação inválida ou no futuro", 400));
            return;
        }
        if (rest.id !== undefined) {
            next(new APIError("Não é permitido alterar o ID do agente", 400));
            return;
        }
        if (Object.keys(rest).length > 0) {
            next(new APIError("Campo(s) inválido(s): " + Object.keys(rest).join(", "), 400));
            return;
        }
        const agenteAtualizado = await agentesRepository.update(id, fieldsToUpdate);
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
    try {
        const resultado = await agentesRepository.remove(id);
        if (!resultado) {
            next(new APIError("Agente não encontrado", 404));
            return;
        }
        res.status(204).send();
    } catch (error) {
        next(error);
    }
};

module.exports = {
    getAllAgentes,
    getAgenteById,
    createAgente,
    updateAgente,
    updateAgentePartial,
    deleteAgente
};