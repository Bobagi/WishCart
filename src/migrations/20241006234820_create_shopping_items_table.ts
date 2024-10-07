import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('shopping_items', (table) => {
    table.increments('id').primary();
    table.string('item_name', 255).notNullable();
    table.string('brand', 100).nullable();
    table.string('size', 50).nullable();
    table.timestamp('created_at').defaultTo(knex.fn.now());
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('shopping_items');
}
