const Joi = require('joi');
const { Date } = require('neo4j-driver/lib/temporal-types.js');
const driver = require('./db');

module.exports = {
  schema: Joi.object({
    romajiTitle: Joi.string().required(),
    englishTitle: Joi.string()
      .allow(null)
      .allow(''),
    nativeTitle: Joi.string()
      .allow(null)
      .allow(''),
    description: Joi.string()
      .allow(null)
      .allow(''),
    startDate: Joi.date(),
    endDate: Joi.date()
      .allow(null)
      .allow(''),
    nbEpisodes: Joi.number()
      .allow(null)
      .allow(''),
    trailer: Joi.string(),
    xLargeCover: Joi.string(),
    largeCover: Joi.string(),
    mediumCover: Joi.string(),
    avgScore: Joi.number(),
    popularity: Joi.number()
  }),

  async save(inputObj) {
    console.log(inputObj.englishTitle);
    if (this.schema.validate(inputObj).error) throw this.schema.validate(inputObj).error;

    const newAnimeInput = {
      ...inputObj,
      startDate: Date.fromStandardDate(inputObj.startDate),
      endDate: inputObj.endDate ? Date.fromStandardDate(inputObj.endDate) : null,
      description: inputObj.description.replace(/<[^>]*>/g, ' ').replace(/(\r\n|\n|\r)/gm, '')
    };

    const session = driver.session({ bookmarks: this.schema.bookmarks || [] });
    const saveAnime = await session.run(
      `CREATE (a:ANIME {
          animeId: randomUUID(),
          romajiTitle : $romajiTitle,
          englishTitle : $englishTitle,
          nativeTitle : $nativeTitle,
          startDate : $startDate,
          endDate : $endDate,
          description : $description,
          nbEpisodes : $nbEpisodes,
          trailer : $trailer,
          xLargeCover : $xLargeCover,
          largeCover : $largeCover,
          mediumCover : $mediumCover,
          avgScore : $avgScore,
          popularity : $popularity
        }) RETURN  a`,
      newAnimeInput
    );

    await session.close();

    return {
      record: saveAnime.records[0].toObject().a.properties,
      bookmarks: session.lastBookmark()
    };
  }
};
