const fs = require('fs');

const Knex = require('knex');
const bluebird = require('bluebird');
const { Model } = require('objection');
const { development } = require('./knexfile');
const Anime = require('./models/anime');
const Studio = require('./models/studio');
const Genre = require('./models/genre');
const Tag = require('./models/tag');
const Theme = require('./models/theme');

const knex = Knex(development);
Model.knex(knex);

const helper = async tags => {
  const tagsMapping = await Tag.mapExistingTag(tags);
  const themesMapping = await Theme.mapExistingTheme([...new Set(tags.map(el => el.category))]);

  const finalTags = tagsMapping.map(tag => {
    const matchTheme = themesMapping.find(theme => theme.name === tag.category);
    const { category, ...currentTag } = tag;

    if (matchTheme) {
      currentTag.theme = matchTheme;
    } else if (!currentTag.id) {
      currentTag.theme = { name: category };
    }

    return currentTag;
  });

  const finalTagsRef = finalTags.reduce((acc, cur) => {
    const currentTag = { ...cur };

    if (!currentTag.id) {
      const similarTheme = acc.find(
        accTag => !accTag.id && accTag.theme.name === currentTag.theme.name
      );

      if (!similarTheme) {
        currentTag.theme['#id'] = currentTag.theme.name;
      } else {
        currentTag.theme = {
          '#ref': currentTag.theme.name
        };
      }
    }

    acc.push(currentTag);

    return acc;
  }, []);

  return finalTagsRef;
};

fs.readFile('./result.json', async (err, result) => {
  const items = JSON.parse(result);

  const sync = await bluebird.mapSeries(items.result, async item => {
    // console.log(item.studios);
    const newGraph = await bluebird.props({
      romanjiTitle: item.title.romaji,
      englishTitle: item.title.english,
      nativeTitle: item.title.native,
      description: item.description,
      xLargeCover: item.coverImage.extraLarge,
      largeCover: item.coverImage.large,
      trailer: `https://www.youtube.com/watch?v=${item.trailer.id}`,
      mediumCover: item.coverImage.medium,
      popularity: item.popularity,
      startDate: new Date(item.startDate.year, item.startDate.month, item.startDate.day),
      endDate: new Date(item.endDate.year, item.endDate.month, item.endDate.day),
      avgScore: item.averageScore,
      nbEpisodes: item.episodes,
      genres: Genre.mapExistingGenre(item.genres),
      studio: Studio.mapExistingStudio(item.studios.nodes[0]),
      externalLinks: item.externalLinks,
      reviews: item.reviews.nodes.map(el => {
        const { id, ...rest } = el;
        return rest;
      }),
      characters: item.characters.nodes.map(el => {
        return {
          firstName: el.name.first,
          lastName: el.name.last,
          nativeName: el.name.native,
          largeImage: el.image.large,
          mediumImage: el.image.medium,
          description: el.description
        };
      }),
      tags: helper(
        item.tags.map(el => {
          const { id, ...rest } = el;
          return rest;
        })
      )
    });

    const insert = await Anime.query().insertGraph(newGraph, { relate: true, allowRefs: true });
    console.log(insert);
  });
});

console.log('start');
