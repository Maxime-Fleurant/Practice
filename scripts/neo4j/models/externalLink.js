const Joi = require('joi');
const driver = require('./db');

module.exports = {
  schema: Joi.object({
    url: Joi.string().required(),
    site: Joi.string().required()
  }),

  async save(inputObj) {
    if (this.schema.validate(inputObj).error) throw new Error('Validation Error');

    const newLinkInput = { ...inputObj };

    const session = driver.session();
    const saveLink = await session.run(
      `CREATE (a:EXTERNALLINK {
        externalLinkId: randomUUID(),
        url : $url,
        site : $site
      }) RETURN  a`,
      newLinkInput
    );

    await session.close();

    return {
      record: saveLink.records[0].toObject().a.properties,
      bookmarks: session.lastBookmark()
    };
  }
};
