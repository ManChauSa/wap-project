const getDb = require("../util/database").getDb;

class User {
  constructor(username, password) {
    this.username = username;
    this.password = password;
  }

  save() {
    const db = getDb();
    db.collection("users").insertOne(this);
  }

  static login(username, password) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ username: username, password: password });
  }

  static findByUsername(username) {
    const db = getDb();
    return db.collection("users").findOne({ username: username });
  }

  static getAllUsers() {
    const db = getDb();
    return db.collection("users").find().toArray();
  }
}

module.exports = User;
