/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex) {
    return knex.schema.createTable('agentes', (table)=>{
        table.increments('id').primary();
        table.string('nome').notNullable();
        table.date('dataDeIncorporacao').notNullable();
        table.string('cargo').notNullable();
    })
  
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex)  {
  return knex.schema.dropTableIfExists('agentes');
};
