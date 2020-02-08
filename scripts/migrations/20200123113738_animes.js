exports.up = knex => {
  return knex.schema.dropTableIfExists('user').then(() => {
    return knex.schema.createTable('animes', table => {
      table
        .bigIncrements('id')
        .unique()
        .primary();
      table.string('romanjiTitle');
      table.string('englishTitle');
      table.string('nativeTitle');
      table.text('description');
    });
  });
};

exports.down = knex => {};
