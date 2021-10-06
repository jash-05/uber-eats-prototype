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
    console.log("Adding order item with following data: ")
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

exports.fetchOrdersForCustomer = (req, res) => {
    console.log(req.query);
    Order.getAllOrdersByCustomer(req.query.customer_ID, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occured while retrieving orders!"
            });
        else res.send(data);
    })
}

exports.fetchOrdersForRestaurant = (req, res) => {
    console.log(req.query);
    Order.getAllOrdersByRestaurant(req.query.restaurant_ID, (err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occured while retrieving orders!"
            });
        else res.send(data);
    })
}

exports.placeOrder = (req, res) => {
    console.log("Placing order with the following params");
    console.log(req.body)
    let order_dict = {
        order_ID: req.body.order_ID,
        total_amount: req.body.total_amount,
        address_ID: req.body.address_ID
    }
    Order.placeOrder(order_dict, (err, data) => {
        if(err){
            res.status(500).send({
                message:
                    err.message || "Some error occured while placing the order"
            });
        } else {
            console.log(data);
            res.send(data);
        }
    })
}

exports.updateStatus = (req, res) => {
    console.log("Updating order status to: ", req.body)
    Order.updateOrderStatus(req.body, (err, data) => {
        if(err){
            res.status(500).send({
                message:
                    err.message || "Some error occured while updating the order status"
            });
        } else {
            console.log(data);
            res.send(data);
        }
    })
}