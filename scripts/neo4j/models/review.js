const Joi = require('joi');
const driver = require('./db');

module.exports = {
  schema: Joi.object({
    score: Joi.number().required(),
    summary: Joi.string().required()
  }),

  async save(inputObj) {
    if (this.schema.validate(inputObj).error) throw this.schema.validate(inputObj).error;

    const newLinkInput = { ...inputObj };

    const session = driver.session();
    const saveLink = await session.run(
      `CREATE (a:REVIEW {
        reviewId: randomUUID(),
        score : $score,
        summary : $summary
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
