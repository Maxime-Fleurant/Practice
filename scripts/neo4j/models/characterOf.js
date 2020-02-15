const Joi = require('joi');
const driver = require('./db');

module.exports = {
  schema: Joi.object({
    from: Joi.string().required(),
    to: Joi.string().required(),
    bookmarks: Joi.array()
  }),

  async save(inputObj) {
    if (this.schema.validate(inputObj).error) throw new Error('Validation Error');

    const newLinkInput = { ...inputObj };

    const session = driver.session({ bookmarks: this.schema.bookmarks || [] });
    const saveLink = await session.run(
      `MATCH (l:CHARACTER {characterId:$from})
      MATCH (a:ANIME {animeId:$to})
      CREATE (l)-[r:character_of]->(a)
      RETURN r`,
      newLinkInput
    );

    await session.close();

    return { record: saveLink.records[0].toObject(), bookmarks: session.lastBookmark() };
  }
};
