const e = require("express");
const Order = require("../models/order.model.js");

exports.getOrder = (req, res) => {
    console.log(req.query);
    Order.getOrderInfo(req.query.customer_ID, req.query.restaurant_ID, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occured while retrieving order!"
            });
        else {
            if (data.length==0){
                let order_dict = {
                    restaurant_ID: req.query.restaurant_ID,
                    customer_ID: req.query.customer_ID,
                    order_status: "in-cart"
                }
                Order.createOrder(order_dict, (err, data) => {
                    if(err)
                    res.status(500).send({
                        message:
                            err.message || "Some error occured while creating a new order"
                    });
                    else {
                        res.send(data);
                    };
                });
                
            } else {
                console.log(data[0].order_ID)
                Order.getAllOrderItems(data[0].order_ID, (err, fetched_items) => {
                    if (err)
                        res.status(500).send({
                            message:
                                err.message || "Some error occured while retrieving order items!"
                        });
                    else {
                        res.send(Object.assign({}, data[0], {"dishes": fetched_items}))
                    }
                })
            }
        } 
    })
}

exports.addItem = (req, res) => {
    console.log(req.body);
    
    let order_item_dict = {
        order_ID: req.body.order_ID,
        dish_ID: req.body.dish_ID,
        quantity: req.body.quantity
    }

    if (!req.body.order_ID) {
        let order_dict = {
            restaurant_ID: req.body.restaurant_ID,
            customer_ID: req.body.customer_ID,
            order_status: "in-cart"
        }
        Order.createOrder(order_dict, (err, data) => {
            if(err)
            res.status(500).send({
                message:
                    err.message || "Some error occured while creating a new order"
            });
            else {
                console.log(data)
                order_item_dict["order_ID"] = data.order_ID
                Order.upsertOrderItem(order_item_dict, (err, data) => {
                    if (err)
                    res.status(500).send({
                        message:
                            err.message || "Some error occured while upserting order item"
                    });
                    else {
                        res.send(data)
                    }
                });
            };
        });
    } else {
        console.log("Order found, updating order item")
        Order.upsertOrderItem(order_item_dict, (err, data) => {
            if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occured while upserting order item"
            });
            else {
                res.send(data)
            }
        });
    }
};

exports.findAll = (req, res) => {
    console.log(req.query);
    let all_food_options = ["vegetarian", "non_vegetarian", "vegan"];
    let all_delivery_options = ["delivery", "pickup"];
    let selected_food_options = [];
    let selected_delivery_option = "";
    for (let key in req.query){
        if (all_food_options.includes(key) && req.query[key]=="true") {
            selected_food_options.push(`${key}=1`);
        } else if (all_delivery_options.includes(key) && req.query[key]=="true") {
            selected_delivery_option = key;
        }
    }
    let food_option_string = `${selected_food_options.join(" OR ")}`;
    let query_string = "SELECT * FROM restaurants WHERE";
    if (food_option_string){
        query_string = `${query_string} (${food_option_string}) AND (${selected_delivery_option}=1);`;
    } else {
        query_string = `${query_string} ${selected_delivery_option}=1;`;
    }
    console.log(query_string);
    Restaurant.getAll(query_string, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving restaurants!"
            });
        else res.send(data);
    });
};

// Authenticate a single Restaurant with email_ID and password
exports.authenticate = (req, res) => {
    console.log(req.body)
    Restaurant.authenticateCreds(req.body.email_id, req.body.pass, (err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Restaurant with email_id: ${req.body.email_id} and pass: ${req.body.pass}.`
          });
        } else {
          res.status(500).send({
            message: "Error retrieving Restaurant with email_id " + req.body.email_id
          });
        }
      } else res.send(data);
    });
  };

exports.findOne = (req, res) => {
    Restaurant.findById(req.params.restaurantId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    message: `Not found restaurant with id: ${req.params.restaurantId}`
                });
            } else {
                res.status(500).send({
                    message: `Error retrieving restaurant with id: ${req.params.restaurantId}`
                });
            }
        } else res.send(data);
    });
};

exports.update = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    Restaurant.updateById(
        req.params.restaurantId, new Restaurant(req.body), (err, data) => {
            if (err) {
                if (err.kind === "not_found") {
                    res.status(404).send({
                        message: `Not found restaurant with id: ${req.params.restaurantId}`
                    });
                } else {
                    res.status(500).send({
                        message: `Error updating restaurant with id: ${req.params.restaurantId}`
                    });
                }
            } else res.send(data)
        }
    );
};

