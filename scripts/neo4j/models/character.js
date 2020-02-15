const Joi = require('joi');
const driver = require('./db');

module.exports = {
  schema: Joi.object({
    firstName: Joi.string(),
    lastName: Joi.string().allow(null),
    nativeName: Joi.string().allow(null),
    largeImage: Joi.string(),
    mediumImage: Joi.string(),
    description: Joi.string()
  }),

  async save(inputObj) {
    if (this.schema.validate(inputObj).error) throw this.schema.validate(inputObj).error;

    const newLinkInput = { ...inputObj };

    const session = driver.session();
    const saveLink = await session.run(
      `CREATE (a:CHARACTER {
        characterId: randomUUID(),
        firstName : $firstName,
        lastName : $lastName,
        nativeName : $nativeName,
        description : $description,
        largeImage : $largeImage,
        mediumImage : $mediumImage
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
