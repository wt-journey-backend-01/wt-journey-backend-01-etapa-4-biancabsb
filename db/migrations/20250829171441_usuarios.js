/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function up(knex)  {
  return knex.schema.createTable("usuarios", (table) => {
    table.increments("id").primary();
    table.string("nome").notNullable();
    table.string("email").notNullable().unique();
    table.string("senha").notNullable();
    table.timestamps(true, true);
  });
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
export async function down(knex)  {
  return knex.schema.dropTableIfExists("usuarios");
};
