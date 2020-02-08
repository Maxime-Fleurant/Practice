exports.up = knex => {
  return knex.schema.table('animes', table => {
    table.specificType('nbEpisodes', 'smallint');
  });
};

exports.down = knex => {};
