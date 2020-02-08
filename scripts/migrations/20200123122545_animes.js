exports.up = knex => {
  return knex.schema
    .createTable('themes', table => {
      table.bigIncrements('id').primary();
      table.string('name').unique();
    })
    .createTable('genre', table => {
      table.bigIncrements('id').primary();
      table.string('name').unique();
    })
    .createTable('externalLinks', table => {
      table.bigIncrements('id').primary();
      table
        .bigInteger('animeId')
        .references('id')
        .inTable('animes')
        .onDelete('CASCADE');
      table.string('site').notNullable();
      table.string('url').notNullable();
    })
    .createTable('reviews', table => {
      table.bigIncrements('id').primary();
      table
        .bigInteger('animeId')
        .references('id')
        .inTable('animes')
        .onDelete('CASCADE');
      table.specificType('score', 'smallInt');
      table.text('summary');
    })
    .createTable('characters', table => {
      table.bigIncrements('id').primary();
      table
        .bigInteger('animeId')
        .references('id')
        .inTable('animes')
        .onDelete('CASCADE');
      table.string('firstName');
      table.string('lastName');
      table.string('nativeName');
      table.string('largeImge');
      table.string('mediumImage');
      table.text('description');
    });
};

exports.down = knex => {};
