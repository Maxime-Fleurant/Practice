const { Model } = require('objection');

class Studio extends Model {
  static get tableName() {
    return 'studios';
  }

  static get relationMappings() {
    const Anime = require('./anime');

    return {
      animes: {
        relation: Model.HasManyRelation,
        modelClass: Anime,
        join: {
          from: 'studios.id',
          to: 'animes.studioId'
        }
      }
    };
  }

  static async mapExistingStudio(studio) {
    const existingstudio = await this.query().where('name', studio.name);

    return (
      existingstudio[0] || {
        name: studio.name,
        url: studio.siteUrl
      }
    );
  }
}

module.exports = Studio;
