exports.up = knex => {
  return knex.schema
    .createTable('tags', table => {
      table.bigIncrements('id').primary();
      table.string('name').unique();
      table.text('description');
      table
        .bigInteger('themeId')
        .references('id')
        .inTable('themes')
        .onDelete('SET NULL');
    })
    .createTable('animes_tags', table => {
      table
        .bigInteger('animeId')
        .references('id')
        .inTable('animes')
        .onDelete('CASCADE');
      table
        .bigInteger('tagId')
        .references('id')
        .inTable('tags')
        .onDelete('CASCADE');
    })
    .createTable('animes_genres', table => {
      table
        .bigInteger('animeId')
        .references('id')
        .inTable('animes')
        .onDelete('CASCADE');
      table
        .bigInteger('genreId')
        .references('id')
        .inTable('genre')
        .onDelete('CASCADE');
    });
};

exports.down = knex => {};
