exports.up = knex => {
  return knex.schema
    .createTable('studios', table => {
      table.bigIncrements('id').primary();
      table
        .string('name')
        .notNullable()
        .unique();
      table.string('url');
    })
    .table('animes', table => {
      table.string('trailer');
      table.string('xLargeCover');
      table.string('largeCover');
      table.string('mediumCover');
      table.specificType('avgScore', 'smallInt');
      table
        .bigInteger('studioId')
        .references('id')
        .inTable('public.studios')
        .onDelete('SET NULL');
    });
};

exports.down = knex => {};
