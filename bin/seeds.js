require('dotenv').config();
const mongoose = require('mongoose');

const dbName = 'pizzapp';
const dbUri = process.env.MONGO_URI || `mongodb://localhost/${dbName}`;
const userSeeds = require('./userSeeds');

mongoose.Promise = Promise;

mongoose
  .connect(dbUri, { useMongoClient: true })
  .then(() => {
    console.log(`Connected to the ${dbUri} database!`);
    mongoose.connection.db.dropDatabase().then(() => {
      userSeeds().then(() => {
        console.log('carried out the seeds');
        mongoose.connection.close();
      });
    });
  })
  .catch(error => console.log(error));
