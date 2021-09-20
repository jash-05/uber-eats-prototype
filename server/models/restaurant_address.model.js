const conn = require("./db.js");

// RestaurantAddresses model constructor
const RestaurantAddress = function (restaurantAddress) {
    this.restaurant_ID = restaurantAddress.restaurant_ID,
    this.line1 = restaurantAddress.line1,
    this.line2 = restaurantAddress.line2,
    this.city = restaurantAddress.city,
    this.state_name = restaurantAddress.state_name,
    this.zipcode = restaurantAddress.zipcode,
    this.address_type = restaurantAddress.address_type
}

// Create function
RestaurantAddress.createAddressForRestaurant = (newAddress, result) => {
  conn.query("INSERT INTO restaurant_addresses SET ?", newAddress, (err, res) => {
    if (err) {
      console.log(`Error while creating new restaurant address entry: ${err}`);
      result(err, null);
      return;
    }
    console.log("Created new entry into restaurant addresses table: ", { address_ID: res.insertId, ...newAddress });
    result(null, { address_ID: res.insertId, ...newAddress });
  });
};

// Read function
RestaurantAddress.getAddressForRestaurant = (restaurant_ID, result) => {
  conn.query(`SELECT * FROM restaurant_addresses WHERE restaurant_ID = ${restaurant_ID}`, (err, res) => {
    if (err) {
      console.log(`Error while trying to fetch addresses for restaurant_ID ${restaurant_ID}: ${err}`);
      result(null, err);
      return;
    }
    console.log(`Fetched addresses for restaurant ${restaurant_ID}: ${res}`);
    result(null, res);
  });
};

module.exports = RestaurantAddress;