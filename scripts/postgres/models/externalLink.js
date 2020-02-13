const { Model } = require('objection');

class ExternalLink extends Model {
  static get tableName() {
    return 'externalLinks';
  }

  static get relationMappings() {
    const Anime = require('./anime');

    return {
      anime: {
        relation: Model.BelongsToOneRelation,
        modelClass: Anime,
        join: {
          from: 'externalLinks.animeId',
          to: 'animes.id'
        }
      }
    };
  }
}

module.exports = ExternalLink;
