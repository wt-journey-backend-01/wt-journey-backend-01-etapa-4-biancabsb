/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex)  {
    return knex.schema.createTable('casos', (table) => {
        table.increments('id').primary();
        table.string('titulo').notNullable();
        table.string('descricao').notNullable();
        table.enu('status', ['aberto', 'solucionado']).notNullable();
       table.integer("agentes_id").references("id").inTable("agentes").onDelete("cascade");
    })
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex)  {
    return knex.schema.dropTableIfExists('casos');

};
