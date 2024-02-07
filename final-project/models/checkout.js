const getDb = require("../util/database").getDb;
const { ObjectId } = require("mongodb");

class Checkout {
    constructor(userName, price, date) {
        this.userName = userName;
        this.price = price;
        this.date = date;
    }
    save() {
        const db = getDb();
        db.collection("checkouts").insertOne(this);
    }
    static getUserHistory(user) {
        const db = getDb();
        return db.collection("checkouts").find({ userName: user }).toArray();
    }
    static getAllHistory() {
        const db = getDb();
        return db.collection("checkouts").find().toArray();
    }

}
module.exports = Checkout;