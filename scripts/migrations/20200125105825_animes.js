exports.up = function(knex) {
  return knex.schema.table('animes', table => {
    table.date('startDate');
    table.date('endDate');
  });
};

exports.down = function(knex) {};
