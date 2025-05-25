import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const uri = process.env.MONGODB_URI;
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient>;

declare global {
  // Variável global para persistir conexão em dev e prod
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (!global._mongoClientPromise) {
  client = new MongoClient(uri, options);
  global._mongoClientPromise = client.connect();
}

clientPromise = global._mongoClientPromise;

clientPromise
  .then(() => {
    console.log("MongoDB client conectado com sucesso");
  })
  .catch((err) => {
    console.error("Falha ao conectar o cliente MongoDB:", err);
  });

export default clientPromise;
