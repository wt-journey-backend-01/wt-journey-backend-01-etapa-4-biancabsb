import db from '../db/connection.js';

async function create (object){
   try{
     const [id] = await db("usuarios").insert(object);
     return findById(id);
   } catch (error) {
     throw error;
   }
}

async function findById(id) {
   try {
     const user = await db("usuarios").where({ id }).first();
     return user;
   } catch (error) {
     throw error;
   }
}

async function findByEmail(email) {
   try {
     const user = await db("usuarios").where({ email }).first();
     return user;
   } catch (error) {
     throw error;
   }
}
async function update(id, fieldsToUpdate) {
   try {
     await db("usuarios").where({ id }).update(fieldsToUpdate);
     return findById(id);
   } catch (error) {
     throw error;
   }
}
async function remove(id) {
   try {
     await db("usuarios").where({ id }).del();
   } catch (error) {
     throw error;
   }
}
export default {
   create,
   findById,
   findByEmail,
   update,
   remove
};
