const conn = require("./db.js");

// constructor
const Dish = function (dish) {
    this.dish_name = dish.dish_name,
    this.category_ID = dish.category_ID,
    this.main_ingredients = dish.main_ingredients,
    this.restaurant_ID = dish.restaurant_ID,
    this.price = dish.price,
    this.about = dish.about,
    this.dish_image = dish.dish_image
}

Dish.create = (newDish, result) => {
    conn.query("INSERT INTO dishes SET ?", newDish, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created dish with dish_ID: ", { dish_id: res.insertId, ...newDish});
        result(null, { dish_id: res.insertId, ...newDish });
    });
};

Dish.getAll = (restaurant_ID, result) => {
    conn.query(`SELECT * FROM dishes WHERE restaurant_ID = ${restaurant_ID}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(null, err);
            return;
        }

        console.log("dishes: ", res);
        result(null, res)
    });
};

Dish.updateById = (id, restaurant, result) => {
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

 
module.exports = Dish;