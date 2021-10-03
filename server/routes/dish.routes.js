module.exports = app => {
    const dishes = require("../controllers/dish.controller.js");

    app.post("/dish", dishes.create);

    app.get("/dish", dishes.findAll);

    app.put("/restaurant/:restaurantId/dish/:dishId", dishes.update);
}