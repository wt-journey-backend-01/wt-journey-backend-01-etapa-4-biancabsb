/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
import bcrypt from 'bcryptjs';

export async function seed(knex) {
  // Apaga todos os registros existentes
  await knex('usuarios').del();

  // Gera hashes para as senhas
  const senha1 = await bcrypt.hash('123456', 10);
  const senha2 = await bcrypt.hash('abcdef', 10);
  const senha3 = await bcrypt.hash('senha123', 10);

  // Insere registros iniciais
  await knex('usuarios').insert([
    { nome: 'Bianca Barros', email: 'bianca@example.com', senha: senha1 },
    { nome: 'João Silva', email: 'joao@example.com', senha: senha2 },
    { nome: 'Maria Santos', email: 'maria@example.com', senha: senha3 }
  ]);
}
