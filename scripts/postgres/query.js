const Knex = require('knex');
const { Model } = require('objection');
const { development } = require('./knexfile');
const Anime = require('./models/anime');

const knex = Knex(development);
Model.knex(knex);

const test = async () => {
  const res = await Anime.query()
    .findById('21')
    .withGraphFetched('[genres, tags.theme, studio, externalLinks, reviews]');

  console.log(res);
};

test();
