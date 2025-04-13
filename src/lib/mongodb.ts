import { MongoClient } from "mongodb";

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your Mongo URI to .env.local");
}

const uri = process.env.MONGODB_URI;
const options = {};

let client;
let clientPromise: Promise<MongoClient>;

// Definição do tipo global para persistência durante HMR
declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined;
}

if (process.env.NODE_ENV === "development") {
  // Em desenvolvimento, usamos uma variável global para preservar a conexão
  // durante o recarregamento de módulo causado por HMR (Hot Module Replacement)
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options);
    global._mongoClientPromise = client.connect().catch((err) => {
      console.error("Erro ao conectar ao MongoDB:", err);
      throw err;
    });
  }
  clientPromise = global._mongoClientPromise;
} else {
  // Em produção, é melhor não usar uma variável global
  client = new MongoClient(uri, options);
  clientPromise = client.connect().catch((err) => {
    console.error("Erro ao conectar ao MongoDB:", err);
    throw err;
  });
}

// Adicione um tratamento para verificar a conexão
clientPromise
  .then(() => {
    console.log("MongoDB client conectado com sucesso");
  })
  .catch((err) => {
    console.error("Falha ao conectar o cliente MongoDB:", err);
  });

// Exporta uma promessa do cliente MongoClient. Ao fazer isso em um
// módulo separado, o cliente pode ser compartilhado entre funções.
export default clientPromise;
