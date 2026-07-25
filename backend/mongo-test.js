import { MongoClient } from "mongodb";

const uri = process.env.MONGO_URI;

const client = new MongoClient(uri);

try {
  await client.connect();
  console.log("Connected!");
} catch (e) {
  console.error(e);
} finally {
  await client.close();
}