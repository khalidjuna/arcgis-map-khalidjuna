/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
  return Promise.all([
    knex.schema.createTable("points", function (table) {
      table.increments("id").primary();
      table.double("x", 15, 10).notNullable(); // Total digit 15, dengan 10 di belakang koma
      table.double("y", 15, 10).notNullable();
      table.double("ratio", 15, 10).notNullable();
      table.double("orientation", 15, 10).notNullable();
      table.integer("user_id").unsigned().references("id").inTable("users");
      table.timestamps(true, true);
    }),
  ]);
};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {
  return Promise.all([knex.schema.dropTableIfExists("points")]);
};
