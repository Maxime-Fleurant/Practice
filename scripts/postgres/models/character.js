const { Model } = require('objection');

class Character extends Model {
  static get tableName() {
    return 'characters';
  }

  static get relationMappings() {
    const Anime = require('./anime');

    return {
      anime: {
        relation: Model.BelongsToOneRelation,
        modelClass: Anime,
        join: {
          from: 'characters.animeId',
          to: 'animes.id'
        }
      }
    };
  }
}

module.exports = Character;
