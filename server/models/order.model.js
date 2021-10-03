const e = require("express");
const conn = require("./db.js");

// constructor
const Order = function (order) {
    this.order_ID = order.order_ID,
    this.restaurant_ID = order.restaurant_ID,
    this.customer_ID = order.customer_ID,
    this.address_ID = order.address_ID,
    this.order_status = order.order_status,
    this.total_amount = order.total_amount
}


Order.createOrder = (newOrder, result) => {
    conn.query("INSERT INTO orders SET ?", newOrder, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }

        console.log("created order with order_ID: ", { order_ID: res.insertId, ...newOrder});
        result(null, { order_ID: res.insertId, ...newOrder });
    });
};


Order.upsertOrderItem = (newOrderItem, result) => {
    conn.query(`SELECT * FROM order_details WHERE order_ID=${newOrderItem.order_ID} AND dish_ID=${newOrderItem.dish_ID}`, (err, res) => {
        if (err) {
            console.log("error: ", err);
            result(err, null);
            return;
        }
        console.log(res);
        if (res.length == 0) {
            conn.query(`INSERT INTO order_details SET ?`, newOrderItem, (err, res) => {
                if(err) {
                    console.log("error: ", err);
                    result(err, null);
                    return;
                }
                console.log("created new order item with order_item_ID: ", {order_item_ID: res.insertId, ...newOrderItem});
                result(null, { order_item_ID: res.insertId, ...newOrderItem});
            });
        } else if (res.length > 1) {
            result(`Multiple occurences present in order details table where order_ID=${newOrderItem.order_ID} and dish_ID=${newOrderItem.dish_ID}`, null)
            return;
        } else {
            conn.query(`UPDATE order_details SET quantity=${newOrderItem.quantity} WHERE order_ID=${newOrderItem.order_ID} AND dish_ID=${newOrderItem.dish_ID}`, (err, res) => {
                if (err) {
                    console.log("error: ", err);
                    result(err, null);
                    return; 
                }
                console.log("Updated order details table");
                result(null, res);
            })
        }
    });
};

Order.getAll = (restaurant_ID, result) => {
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

Order.updateById = (id, restaurant, result) => {
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

 
module.exports = Order;