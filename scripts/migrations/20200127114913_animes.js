exports.up = function(knex) {
  return knex.schema.table('reviews', table => {
    table.text('body');
  });
};

exports.down = function(knex) {};
