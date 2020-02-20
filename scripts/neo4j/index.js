const fs = require('fs').promises;
const bluebird = require('bluebird');

const AnimeModel = require('./models/anime');
const ExternalLinkModel = require('./models/externalLink');
const ReviewModel = require('./models/review');
const CharacterModel = require('./models/character');
const StudioModel = require('./models/studios');
const GenreModel = require('./models/genre');
const TagModel = require('./models/tag');
const ThemeModel = require('./models/theme');

const linkOf = require('./models/link_of');
const reviewOf = require('./models/reviewOf');
const characterOf = require('./models/characterOf');
const fromStudio = require('./models/fromStudio');
const inGenre = require('./models/inGenre');
const inTag = require('./models/inTag');
const inTheme = require('./models/inTheme');

const start = async () => {
  const bresult = JSON.parse(await fs.readFile('./result.json')).result;

  const insert = await bluebird.map(
    bresult,
    (result, index) => {
      console.log(index);

      const task = async () => {
        try {
          console.log('try');
          const batch = await bluebird.props({
            anime: AnimeModel.save({
              romajiTitle: result.title.romaji,
              englishTitle: result.title.english,
              nativeTitle: result.title.native,
              description: result.description,
              startDate: new Date(
                `${result.startDate.year}-${result.startDate.month}-${result.startDate.day}`
              ),
              endDate:
                result.endDate.year && result.endDate.month && result.endDate.day
                  ? new Date(`${result.endDate.year}-${result.endDate.month}-${result.endDate.day}`)
                  : null,
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
            }),
            studio: StudioModel.save({
              name: result.studios.nodes[0].name,
              url: result.studios.nodes[0].siteUrl
            }),
            genres: bluebird.map(result.genres, el => {
              return GenreModel.save({ name: el });
            }),
            tags: bluebird.map(result.tags, el => {
              return TagModel.save({ name: el.name, description: el.description });
            }),
            themes: bluebird.map(result.tags, el => {
              return ThemeModel.save({ name: el.category });
            })
          });

          const { anime, ExternalLink, reviews, characters, studio, genres, tags, themes } = batch;

          const formatedTags = batch.tags.map(tag => {
            const augmentedTag = { ...tag };
            const originalTags = result.tags;
            const { category } = originalTags.find(elem => elem.name === tag.record.name);
            const theme = themes.find(elem => elem.record.name === category);

            augmentedTag.themeId = theme.record.themeId;
            augmentedTag.themeBookmarks = theme.bookmarks;

            return augmentedTag;
          });

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
            }),
            fromStudio: fromStudio.save({
              from: anime.record.animeId,
              to: studio.record.studioId,
              bookmarks: [...anime.bookmarks, ...studio.bookmarks]
            }),
            inGenre: bluebird.map(genres, el => {
              return inGenre.save({
                from: anime.record.animeId,
                to: el.record.genreId,
                bookmarks: [...anime.bookmarks, ...el.bookmarks]
              });
            }),
            inTheme: bluebird.map(formatedTags, el => {
              return inTheme.save({
                from: el.record.tagId,
                to: el.themeId,
                bookmarks: [...el.bookmarks, ...el.themeBookmarks]
              });
            }),
            inTag: bluebird.map(tags, el => {
              return inTag.save({
                from: anime.record.animeId,
                to: el.record.tagId,
                bookmarks: [...anime.bookmarks, ...el.bookmarks]
              });
            })
          });
        } catch (e) {
          console.log(
            result,
            typeof new Date(`${result.endDate.year}-${result.endDate.month}-${result.endDate.day}`)
          );
          console.log(e, 'lfdklk');
        }
      };

      return task();
    },
    { concurrency: 20 }
  );
};

start();
