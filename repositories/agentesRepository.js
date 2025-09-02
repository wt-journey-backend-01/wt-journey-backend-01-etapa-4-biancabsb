
import db from "../db/db.js";
async function create(object) {
    try {
        const created = await db("agentes").insert(object).returning('*');
        return created[0];
    } catch (error) {
        console.error('Erro ao criar agente:', error);
        throw error; 
    }
    }

    async function read(id) {
        try {
            const agente = await db("agentes").select("*").where({ id });
            return agente[0] || null;
        } catch (error) {
            console.error('Erro ao ler agente:', error);
            throw error;
        }
    }
    async function readAll() {
        try {
            const agentes = await db("agentes").select("*");
            return agentes;
        } catch (error) {
            console.error('Erro ao ler todos os agentes:', error);
            throw error;
        }
    }

    async function update(id, fieldsToUpdate) {
        try {
            const updated = await db("agentes").where({ id: id }).update(fieldsToUpdate).returning('*');
            if (updated.length === 0) {
                return false;
            }
            return updated[0];
        } catch (error) {
            console.error('Erro ao atualizar agente:', error);
            throw error;
        }
    }

    async function remove(id) {
        try {
            const deleted = await db("agentes").where({ id: id }).del()
            if (!deleted) {
                return false
            }
            return true
        } catch (error) {
            console.error('Erro ao remover agente:', error);
            throw error;
        }
    }

   export default{
        create,
        read,
        readAll,
        update,
        remove
    }
