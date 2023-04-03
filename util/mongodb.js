//utility function for connecting to database

// MongoClient connects to instance of our database with uri
import { MongoClient } from "mongodb";

let uri = process.env.MONGODB_URI;
let dbName = process.env.MONGODB_DB;

let cachedClient = null;
let cachedDb = null;

if (!uri) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

if (!dbName) {
  throw new Error(
    "Please define the MONGODB_DB environment variable inside .env.local"
  );
}

//utility function that allows us to connect to database and send requests and fetch requests from the database. We will use this function inside of our API routes.
export async function connectToDatabase() {
    //caching
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  //connect to MongoClient and pass uri to connect to database instance. other props passed necessary
  const client = await MongoClient.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });

  //pass dbName to specify which database you want to access
  const db = await client.db(dbName);

  //setting caches which were null at the start of this file
  cachedClient = client;
  cachedDb = db;

  return { client, db };
}