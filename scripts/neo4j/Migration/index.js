const neo4j = require('neo4j-driver');

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'neo4j'));
const session = driver.session();

(async () => {
  try {
    const result = await session.writeTransaction(tx => {
      tx.run('CREATE CONSTRAINT animeId ON (anime:ANIME) ASSERT anime.animeId IS UNIQUE');
      tx.run(
        'CREATE CONSTRAINT externalLinkId ON (externalLink:EXTERNALLINK) ASSERT externalLink.externalLinkId IS UNIQUE'
      );
      tx.run('CREATE CONSTRAINT reviewId ON (review:REVIEW) ASSERT review.reviewId IS UNIQUE');
      tx.run(
        'CREATE CONSTRAINT characterId ON (character:CHARACTER) ASSERT character.characterId IS UNIQUE'
      );
      tx.run('CREATE CONSTRAINT studioId ON (studio:STUDIO) ASSERT studio.studioId IS UNIQUE');
      tx.run('CREATE CONSTRAINT studioName ON (studio:STUDIO) ASSERT studio.name IS UNIQUE');
      tx.run('CREATE CONSTRAINT genreId ON (genre:GENRE) ASSERT genre.genreId IS UNIQUE');
      tx.run('CREATE CONSTRAINT genreName ON (genre:GENRE) ASSERT genre.name IS UNIQUE');
      tx.run('CREATE CONSTRAINT tagId ON (tag:TAG) ASSERT tag.tagId IS UNIQUE');
      tx.run('CREATE CONSTRAINT tagName ON (tag:TAG) ASSERT tag.name IS UNIQUE');
      tx.run('CREATE CONSTRAINT themeId ON (theme:theme) ASSERT theme.themeId IS UNIQUE');
      tx.run('CREATE CONSTRAINT themeName ON (theme:theme) ASSERT theme.name IS UNIQUE');
    });
  } finally {
    await session.close();
  }

  // on application exit:
  await driver.close();
})();
