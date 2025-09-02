/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex)  {
  // Apaga todos os registros existentes
  await knex('agentes').del();

  // Insere registros iniciais
  await knex('agentes').insert([
    { nome: 'João Silva', dataDeIncorporacao: '2020-01-15', cargo: 'Investigador' },
    { nome: 'Maria Souza', dataDeIncorporacao: '2019-05-20', cargo: 'Delegada' },
    { nome: 'Carlos Pereira', dataDeIncorporacao: '2021-09-10', cargo: 'Escrivão' }
  ]);
};
