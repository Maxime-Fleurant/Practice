const neo4j = require('neo4j-driver');

const driver = neo4j.driver('bolt://localhost:7687', neo4j.auth.basic('neo4j', 'neo4j'));
const session = driver.session();

(async () => {
  try {
    const result = await session.writeTransaction(tx => {
      tx.run('CREATE CONSTRAINT studioName ON (studio:STUDIO) ASSERT studio.name IS UNIQUE');
      tx.run('CREATE CONSTRAINT genreName ON (genre:GENRE) ASSERT genre.name IS UNIQUE');
      tx.run('CREATE CONSTRAINT tagName ON (tag:TAG) ASSERT tag.name IS UNIQUE');
      tx.run('CREATE CONSTRAINT themeName ON (theme:theme) ASSERT theme.name IS UNIQUE');
    });
  } finally {
    await session.close();
  }

  // on application exit:
  await driver.close();
})();
