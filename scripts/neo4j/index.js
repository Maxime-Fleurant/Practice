const fs = require('fs').promises;
const bluebird = require('bluebird');

const AnimeModel = require('./models/anime');
const ExternalLinkModel = require('./models/externalLink');
const ReviewModel = require('./models/review');
const CharacterModel = require('./models/character');

const linkOf = require('./models/link_of');
const reviewOf = require('./models/reviewOf');
const characterOf = require('./models/characterOf');

const start = async () => {
  const [result] = JSON.parse(await fs.readFile('./result.json')).result;

  try {
    const batch = await bluebird.props({
      anime: AnimeModel.save({
        romajiTitle: result.title.romaji,
        englishTitle: result.title.english,
        nativeTitle: result.title.native,
        description: result.description,
        startDate: new Date(
          `${result.startDate.year}-${result.startDate.month}-${result.startDate.day}`
        ),
        endDate: new Date(`${result.endDate.year}-${result.endDate.month}-${result.endDate.day}`),
        nbEpisodes: result.episodes,
        trailer: `https://www.youtube.com/watch?v=${result.trailer.id}`,
        xLargeCover: result.coverImage.extraLarge,
        largeCover: result.coverImage.large,
        mediumCover: result.coverImage.medium,
        avgScore: result.averageScore,
        popularity: result.popularity
      }),
      ExternalLink: bluebird.map(result.externalLinks, el => {
        return ExternalLinkModel.save(el);
      }),
      reviews: bluebird.map(result.reviews.nodes, el => {
        const rev = { score: el.score, summary: el.summary };
        return ReviewModel.save(rev);
      }),
      characters: bluebird.map(result.characters.nodes, el => {
        const rev = {
          firstName: el.name.first,
          lastName: el.name.last || null,
          nativeName: el.name.native,
          largeImage: el.image.large,
          mediumImage: el.image.medium,
          description: el.description
        };
        return CharacterModel.save(rev);
      })
    });

    const { anime, ExternalLink, reviews, characters } = batch;

    const linked = await bluebird.props({
      linkOf: bluebird.map(ExternalLink, el => {
        return linkOf.save({
          from: el.record.externalLinkId,
          to: anime.record.animeId,
          bookmarks: [...anime.bookmarks, ...el.bookmarks]
        });
      }),
      reviewOf: bluebird.map(reviews, el => {
        return reviewOf.save({
          from: el.record.reviewId,
          to: anime.record.animeId,
          bookmarks: [...anime.bookmarks, ...el.bookmarks]
        });
      }),
      characterOf: bluebird.map(characters, el => {
        return characterOf.save({
          from: el.record.characterId,
          to: anime.record.animeId,
          bookmarks: [...anime.bookmarks, ...el.bookmarks]
        });
      })
    });

    console.log(linked);
  } catch (e) {
    console.log(e, 'lfdklk');
  }
};

start();
