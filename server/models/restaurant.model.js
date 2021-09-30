const conn = require("./db.js");

// constructor
const Restaurant = function (restaurant) {
    this.restaurant_name = restaurant.restaurant_name,
    this.owner_name = restaurant.owner_name,
    this.email_id = restaurant.email_id,
    this.pass = restaurant.pass,
    this.phone_number = restaurant.phone_number,
    this.vegetarian = restaurant.vegetarian,
    this.non_vegetarian = restaurant.non_vegetarian,
    this.vegan = restaurant.vegan,
    this.delivery = restaurant.delivery,
    this.pickup = restaurant.pickup,
    this.cover_image = restaurant.cover_image,
    this.about = restaurant.about,
    this.opening_time = restaurant.opening_time,
    this.closing_time = restaurant.closing_time
}

Restaurant.create = (newRestaurant, result) => {
    conn.query("INSERT INTO restaurants SET ?", newRestaurant, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created restaurant: ", { restaurant_id: res.insertId, ...newRestaurant});
        result(null, { restaurant_id: res.insertId, ...newRestaurant });
    });
};

Restaurant.getAll = (query_string, result) => {
    conn.query(query_string, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("restaurants: ", res);
        result(null, res)
    });
};

Restaurant.findById = (restaurant_id, result) => {
    conn.query(`SELECT * FROM restaurants WHERE restaurant_ID = ${restaurant_id}`, (err, res) => {
      if (err) {
        console.log("error: ", err);
        result(err, null);
        return;
      }
  
      if (res.length) {
        console.log("found restaurant: ", res[0]);
        result(null, res[0]);
        return;
      }
  
      // not found restaurant with the id
      result({ kind: "not_found" }, null);
    });
  };

Restaurant.updateById = (id, restaurant, result) => {
    conn.query(
      "UPDATE restarants SET email = ?, name = ?, active = ? WHERE id = ?",
      [restaurant.email, restaurant.name, restaurant.active, id],
      (err, res) => {
        if (err) {
          console.log("error: ", err);
          result(null, err);
          return;
        }
  
        if (res.affectedRows == 0) {
          // not found restaurant with the id
          result({ kind: "not_found" }, null);
          return;
        }
  
        console.log("updated restaurant: ", { id: id, ...restaurant });
        result(null, { id: id, ...restaurant });
      }
    );
  };

 
module.exports = Restaurant;