const { Model } = require('objection');

class Genre extends Model {
  static get tableName() {
    return 'genre';
  }

  static get relationMappings() {
    const Anime = require('./anime');

    return {
      animes: {
        relation: Model.ManyToManyRelation,
        modelClass: Anime,
        join: {
          from: 'genres.id',
          through: {
            from: 'animes_genres.genreId',
            to: 'animes_genres.animeId'
          },
          to: 'animes.id'
        }
      }
    };
  }

  static async mapExistingGenre(genres) {
    const existingGenres = await this.query().whereIn('name', genres);

    const filteredGenre = genres
      .filter(genre => {
        return !existingGenres.find(exGenre => exGenre.name === genre);
      })
      .map(genre => {
        return {
          name: genre
        };
      });

    return [...existingGenres, ...filteredGenre];
  }
}

module.exports = Genre;
