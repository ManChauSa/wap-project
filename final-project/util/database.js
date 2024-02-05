const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

let _db;

const mongoConnect = (callback) => {
  MongoClient.connect(
    "mongodb+srv://hlinh0409:b1YZThGiz5wb5Kiy@cluster0.qmbhjbe.mongodb.net/?retryWrites=true&w=majority"
  )
    .then((client) => {
      _db = client.db();
      callback();
    })
    .catch((err) => {
      throw err;
    });
};

const getDb = () => {
  if (_db) {
    return _db;
  }

  throw "No database found!";
};
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
