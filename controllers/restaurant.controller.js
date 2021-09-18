const Restaurant = require("../models/restaurant.model.js");

exports.create = (req, res) => {
    if (!req.body) {
        res.status(400).send({
            message: "Content can not be empty!"
        });
    }

    let restaurant_dict = {
        restaurant_name: req.body.restaurant_name,
        owner_name: req.body.owner_name,
        email_id: req.body.email_id,
        pass: req.body.pass,
        phone_number: req.body.phone_number,
        about: req.body.about,
        pictures: req.body.pictures,
        opening_time: req.body.opening_time,
        closing_time: req.body.closing_time,
        food_types: req.body.food_types
    }

    Restaurant.create(restaurant_dict, (err, data) => {
        if (err)
        res.status(500).send({
            message:
            err.message || "Some error occured while creating the restaurant"
        });
        else res.send(data);
    });
};

exports.findAll = (req, res) => {
    Restaurant.getAll((err, data) => {
        if (err)
            res.status(500).send({
                message:
                    err.message || "Some error occurred while retrieving restaurants!"
            });
        else res.send(data);
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

exports.update() = (req, res) => {
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

