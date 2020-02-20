const Joi = require('joi');
const driver = require('./db');

module.exports = {
  schema: Joi.object({
    name: Joi.string().required(),
    url: Joi.string().required()
  }),

  async save(inputObj) {
    if (this.schema.validate(inputObj).error) throw new Error('Validation Error');

    const newLinkInput = { ...inputObj };

    const session = driver.session();
    const saveLink = await session.run(
      `MERGE (a:STUDIO {
        name : $name,
        url : $url
      })
      ON CREATE SET a.studioId = randomUUID()
      RETURN  a`,
      newLinkInput
    );

    await session.close();

    return {
      record: saveLink.records[0].toObject().a.properties,
      bookmarks: session.lastBookmark()
    };
  }
};
