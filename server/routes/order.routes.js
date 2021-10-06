module.exports = app => {
    const orders = require("../controllers/order.controller.js");

    app.get("/getOrderDetails", orders.getOrder);
    
    app.post("/addOrderItem", orders.addItem);

    app.get("/fetchOrdersForCustomer", orders.fetchOrdersForCustomer);

    app.get("/fetchOrdersForRestaurant", orders.fetchOrdersForRestaurant);
    
    app.post('/placeOrder', orders.placeOrder);

    app.post('/updateOrderStatus', orders.updateStatus);
}