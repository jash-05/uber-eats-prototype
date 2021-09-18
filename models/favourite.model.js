const conn = require("./db.js");

// constructor
const Favourite = function (favourite) {
    this.customer_ID = favourite.customer_ID,
    this.restaurant_ID = favourite.restaurant_ID
}

Favourite.create = (newFavourite, result) => {
  conn.query("INSERT INTO favourites SET ?", newFavourite, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(err, null);
      return;
    }

    console.log("created favourite: ", { favourite_id: res.insertId, ...newFavourite });
    result(null, { favourite_id: res.insertId, ...newFavourite });
  });
};

Favourite.getAll = (customer_ID, result) => {
  conn.query(`SELECT * FROM favourites WHERE customer_ID = ${customer_ID}`, (err, res) => {
    if (err) {
      console.log("error: ", err);
      result(null, err);
      return;
    }

    console.log("favourites: ", res);
    result(null, res);
  });
};

Favourite.remove = (customer_ID, restaurant_ID, result) => {
    conn.query(`DELETE FROM favourites WHERE customer_ID = ${customer_ID} AND restaurant_ID = ${restaurant_ID}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(null, err);
        return;
      }
  
      if (res.affectedRows == 0) {
        // not found  with the id
        result({ kind: "not_found" }, null);
        return;
      }

      console.log(`Deleted favourite with customer_ID: ${customer_ID} and restaurant_ID ${restaurant_ID}`);
      result(null, res);
    });
};

module.exports = Favourite;