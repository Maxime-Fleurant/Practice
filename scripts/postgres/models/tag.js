const { Model } = require('objection');

class Tag extends Model {
  static get tableName() {
    return 'tags';
  }

  static get relationMappings() {
    const Anime = require('./anime');
    const Theme = require('./theme');

    return {
      animes: {
        relation: Model.ManyToManyRelation,
        modelClass: Anime,
        join: {
          from: 'tags.id',
          through: {
            from: 'animes_tags.tagId',
            to: 'animes_tags.animeId'
          },
          to: 'animes.id'
        }
      },
      theme: {
        relation: Model.BelongsToOneRelation,
        modelClass: Theme,
        join: {
          from: 'tags.themeId',
          to: 'themes.id'
        }
      }
    };
  }

  static async mapExistingTag(tags) {
    let existingTags = await this.query().whereIn(
      'name',
      tags.map(el => el.name)
    );

    const filteredTag = tags.filter(tag => {
      return !existingTags.find(exTags => exTags.name === tag.name);
    });

    existingTags = existingTags.map(tag => {
      return {
        id: tag.id
      };
    });

    return [...existingTags, ...filteredTag];
  }
}

module.exports = Tag;
