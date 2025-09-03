/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
export async function seed(knex) {
  // Apaga todos os registros existentes
  await knex('casos').del();

  // Insere registros iniciais
  await knex('casos').insert([
    {
      titulo: 'Roubo de carro',
      descricao: 'Veículo furtado no centro da cidade',
      status: 'aberto',
      agentes_id: 1
    },
    {
      titulo: 'Fraude bancária',
      descricao: 'Transações suspeitas em conta corrente',
      status: 'solucionado',
      agentes_id: 2
    },
    {
      titulo: 'Desaparecimento',
      descricao: 'Pessoa desaparecida no bairro industrial',
      status: 'aberto',
      agentes_id: 3
    }
  ]);
};
