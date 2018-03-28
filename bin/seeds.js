require('dotenv').config();
const mongoose = require('mongoose');

const dbName = 'pizzapp';
// ojo que MONGO_URI me da undefined
const dbUri = process.env.MONGO_URI || `mongodb://localhost/${dbName}`;
const userSeeds = require('./userSeeds');
const restaurantSeeds = require('./restaurantSeeds');

mongoose.Promise = Promise;

mongoose
  .connect(dbUri, { useMongoClient: true })
  .then(() => {
    console.log(`Connected to the ${dbUri} database!`);
    mongoose.connection.db.dropDatabase().then(() => {
      userSeeds().then(() => {
        restaurantSeeds().then(() => {
          console.log('carried out the seeds');
          mongoose.connection.close();
        });
      });
    });
  })
  .catch(error => console.log(error));
