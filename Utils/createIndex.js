const { MongoClient } = require("mongodb");

// MongoDB Atlas connection string
const uri = 'mongodb+srv://bavadiyadhruv:TL1zO2Vscn4QMTA1@databse1.1iownrz.mongodb.net/'

async function createIndex() {
  let client; // Declare the client variable outside the try block

  try {
    if (!uri) {
      throw new Error("DB_URL is not defined in environment variables.");
    }

    client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
    await client.connect();

    const database = client.db("test");
    const collection = database.collection("trafficsignals");

    // Get list of indexes
    const indexes = await collection.indexes();

    // Log the indexes
    console.log(indexes);
  } catch (error) {
    console.error("Error:", error.message);
  } finally {
    if (client) {
      await client.close(); // Make sure to close the client if it's defined
    }
  }
}

createIndex().catch(console.error);
