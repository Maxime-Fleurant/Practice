exports.up = function(knex) {
  return knex.schema.table('characters', table => {
    table.renameColumn('largeImge', 'largeImage');
  });
};

exports.down = function(knex) {};
