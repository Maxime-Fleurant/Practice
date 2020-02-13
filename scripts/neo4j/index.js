const driver = neo4j.driver(uri, neo4j.auth.basic(user, password));
const session = driver.session();

try {
  const result = await session.writeTransaction(tx =>
    tx.run(
      'CREATE (a:Greeting) SET a.message = $message RETURN a.message + ", from node " + id(a)',
      { message: 'hello, world' }
    )
  );

  const singleRecord = result.records[0];

  const greeting = singleRecord.get(0);

  console.log(greeting);
} finally {
  await session.close();
}

// on application exit:
await driver.close();
