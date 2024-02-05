const getDb = require("../util/database").getDb;
const { ObjectId } = require("mongodb");

class Product {
  constructor(title, type, img, description, price, isPopular) {
    this.title = title;
    this.type = type;
    this.img = img;
    this.description = description;
    this.price = price;
    this.isPopular = isPopular;
  }

  saveProductByType(type) {
    const db = getDb();
    db.collection(type).insertOne(this);
  }

  static findProductById(type, productId) {
    const db = getDb();
    return db.collection(type).findOne({ _id: new ObjectId(productId) });
  }

  static getAllProductsByType(type) {
    const db = getDb();
    return db.collection(type).find().toArray();
  }

  static getProductsByPage(page, type, items_per_page) {
    const db = getDb();
    return db
      .collection(type)
      .find()
      .skip((page - 1) * items_per_page)
      .limit(items_per_page)
      .toArray();
  }
}

module.exports = Product;
