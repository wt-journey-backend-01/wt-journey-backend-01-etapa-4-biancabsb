import  db from "../db/db.js";
async function create(object) {
    try {
        const created = await db("casos").insert(object).returning('*');
        return created[0];
    } catch (error) {
        console.error('Erro ao criar caso:', error);
        throw error;
    }
}

async function read(id) {
    try {
        const caso = await db("casos").select("*").where({ id });
        return caso[0] || null;
    } catch (error) {
        console.error('Erro ao ler caso:', error);
        throw error;
    }
}
async function readAll() {
    try {
        const casos = await db("casos").select("*");
        return casos;
    } catch (error) {
        console.error('Erro ao ler todos os casos:', error);
        throw error;
    }
}

async function update(id, fieldsToUpdate) {
    try {
        const updated = await db("casos").where({ id: id }).update(fieldsToUpdate).returning('*');
        if (updated.length === 0) {
            return false;
        }
        return updated[0];
    } catch (error) {
        console.error('Erro ao atualizar caso:', error);
        throw error;
    }
}

async function remove(id) {
    try {
        const deleted = await db("casos").where({ id: id }).del()
        if (!deleted) {
            return false
        }
        return true
    } catch (error) {
        console.error('Erro ao remover caso:', error);
        throw error;
    }
}

export default {
    create,
    read,
    readAll,
    update,
    remove
}
