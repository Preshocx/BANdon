const mongo = require('mongodb');

let client = new mongo.MongoClient("mongodb+srv://perry:"+process.env.dbpass+"@cluster0.o6ym9.mongodb.net/db?retryWrites=true&w=majority", { useNewUrlParser: true, useUnifiedTopology: true })

module.exports = {
  getDb: async function() {
    await client.connect();
    return client.db('db');
  },
};
