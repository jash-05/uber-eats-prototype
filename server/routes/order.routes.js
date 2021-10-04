module.exports = app => {
    const orders = require("../controllers/order.controller.js");

    app.get("/getOrderDetails", orders.getOrder);
    
    app.post("/addOrderItem", orders.addItem);
}