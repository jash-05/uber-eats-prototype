module.exports = app => {
    const orders = require("../controllers/order.controller.js");

    app.post("/addOrderItem", orders.create);
}