import { MongoClient } from "mongodb";

async function createTTLIndex() {
  const client = new MongoClient(process.env.DATABASE_URL);

  try {
    await client.connect();

    const database = client.db("InstaChat");
    const collection = database.collection("Stories");

    const indexExists = await collection.indexExists(
      "createdAt_ttl_index_24hrs"
    );

    if (!indexExists) {
      // Create TTL index on the 'createdAt' field with an expiration time of 24 hours
      const newEntry = await collection.createIndex(
        { createdAt: 1 },
        { name: "createdAt_ttl_index_24hrs", expireAfterSeconds: 86400 }
      );

      console.log("TTL index created successfully.", newEntry);
    } else {
      console.log("TTL Index already exists.");
    }
  } catch (error) {
    console.error("Error creating TTL index:", error);
  } finally {
    await client.close();
  }
}

export default createTTLIndex;
