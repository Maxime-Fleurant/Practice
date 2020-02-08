const { Model } = require('objection');

class Review extends Model {
  static get tableName() {
    return 'reviews';
  }

  static get relationMappings() {
    const Anime = require('./anime');

    return {
      anime: {
        relation: Model.BelongsToOneRelation,
        modelClass: Anime,
        join: {
          from: 'reviews.animeId',
          to: 'animes.id'
        }
      }
    };
  }
}

module.exports = Review;
