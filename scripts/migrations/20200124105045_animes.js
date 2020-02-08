exports.up = function(knex) {
  return knex.schema.table('animes', table => {
    table.integer('popularity');
  });
};

exports.down = function(knex) {};
