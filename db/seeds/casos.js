/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  // Apaga todos os registros existentes
  await knex('casos').del();

  // Insere registros iniciais
  await knex('casos').insert([
    {
      titulo: 'Roubo de carro',
      descricao: 'Veículo furtado no centro da cidade',
      status: 'aberto'
    },
    {
      titulo: 'Fraude bancária',
      descricao: 'Transações suspeitas em conta corrente',
      status: 'solucionado'
    },
    {
      titulo: 'Desaparecimento',
      descricao: 'Pessoa desaparecida no bairro industrial',
      status: 'aberto'
    }
  ]);
};
