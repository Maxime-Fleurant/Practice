const { Model } = require('objection');

class Anime extends Model {
  static get tableName() {
    return 'animes';
  }

  static get relationMappings() {
    const Genre = require('./genre');
    const Studio = require('./studio');
    const ExternalLink = require('./externalLink');
    const Review = require('./review');
    const Character = require('./character');
    const Tag = require('./tag');

    return {
      genres: {
        relation: Model.ManyToManyRelation,
        modelClass: Genre,
        join: {
          from: 'animes.id',
          through: {
            from: 'animes_genres.animeId',
            to: 'animes_genres.genreId'
          },
          to: 'genre.id'
        }
      },
      tags: {
        relation: Model.ManyToManyRelation,
        modelClass: Tag,
        join: {
          from: 'animes.id',
          through: {
            from: 'animes_tags.animeId',
            to: 'animes_tags.tagId'
          },
          to: 'tags.id'
        }
      },
      studio: {
        relation: Model.BelongsToOneRelation,
        modelClass: Studio,
        join: {
          from: 'animes.studioId',
          to: 'studios.id'
        }
      },
      externalLinks: {
        relation: Model.HasManyRelation,
        modelClass: ExternalLink,
        join: {
          from: 'animes.id',
          to: 'externalLinks.animeId'
        }
      },
      reviews: {
        relation: Model.HasManyRelation,
        modelClass: Review,
        join: {
          from: 'animes.id',
          to: 'reviews.animeId'
        }
      },
      characters: {
        relation: Model.HasManyRelation,
        modelClass: Character,
        join: {
          from: 'animes.id',
          to: 'characters.animeId'
        }
      }
    };
  }
}

module.exports = Anime;
