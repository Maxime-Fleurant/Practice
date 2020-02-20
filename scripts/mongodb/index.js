const fs = require('fs').promises;

const mongoose = require('mongoose');
const bluebird = require('bluebird');

const AnimeModel = require('./models/anime');
const GenreModel = require('./models/genre');
const ThemeModel = require('./models/theme');
const TagModel = require('./models/tag.js');
const StudioModel = require('./models/studio');

mongoose.connect('mongodb://anidb:test@localhost:27017/anidb');

const db = mongoose.connection;

db.once('connected', async () => {
  const { result } = JSON.parse(await fs.readFile('./result.json'));

  const batch = await bluebird.map(result, async doc => {
    const preInsert = await bluebird.props({
      tags: await bluebird.map(doc.tags, async elem => {
        const tagTheme = await ThemeModel.findOneAndUpdate(
          { name: elem.category },
          { name: elem.category },
          { upsert: true, new: true }
        ).exec();

        return TagModel.findOneAndUpdate(
          { name: elem.name },
          { name: elem.name, description: elem.description, themeId: tagTheme._id },
          { upsert: true, new: true }
        ).exec();
      }),
      genres: await bluebird.map(doc.genres, elem => {
        return GenreModel.findOneAndUpdate(
          { name: elem },
          { name: elem },
          { upsert: true, new: true }
        ).exec();
      }),
      studio: await StudioModel.findOneAndUpdate(
        { name: doc.studios.nodes[0].name },
        { name: doc.studios.nodes[0].name, url: doc.studios.nodes[0].siteUrl },
        { upsert: true, new: true }
      ).exec()
    });

    console.log(preInsert);

    const anime = new AnimeModel({
      romajiTitle: doc.title.romaji,
      englishTitle: doc.title.english,
      nativeTitle: doc.title.native,
      description: doc.description,
      startDate: new Date(doc.startDate.year, doc.startDate.month, doc.startDate.day),
      endDate: new Date(doc.endDate.year, doc.endDate.month, doc.endDate.day),
      nbEpisodes: doc.episodes,
      trailer: `https://www.youtube.com/watch?v=${doc.trailer.id}`,
      xLargeCover: doc.coverImage.extraLarge,
      largeCover: doc.coverImage.large,
      mediumCover: doc.coverImage.medium,
      avgScore: doc.averageScore,
      externalLinks: doc.externalLinks.map(el => {
        return {
          site: el.site,
          url: el.url
        };
      }),
      reviews: doc.reviews.nodes.map(el => {
        return {
          score: el.score,
          summary: el.summary
        };
      }),
      characters: doc.characters.nodes.map(el => {
        return {
          firstName: el.name.first,
          lastName: el.name.last,
          nativeName: el.name.native,
          LargeImage: el.image.large,
          mediumImage: el.image.medium,
          description: el.description
        };
      }),
      genres: preInsert.genres,
      tags: preInsert.tags,
      studio: preInsert.studio
    });
    const sa = await anime.save();

    console.log('done');
  });
});
