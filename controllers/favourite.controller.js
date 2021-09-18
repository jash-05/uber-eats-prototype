const Favourite = require("../models/favourite.model.js");

// Create and Save a new Customer
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }
    
    let favourite_dict = {
        'customer_ID': req.body.customer_ID,
        'restaurant_ID': req.body.restaurant_ID
    };

    // Save Favourite in the database
    Favourite.create(favourite_dict, (err, data) => {  
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while creating the Favourite."
        });
      else res.send(data);
    });
  };

// Retrieve all Favourites from the database.
exports.findAll = (req, res) => {
    Favourite.getAll(req.params.customer_ID, (err, data) => {
      if (err)
        res.status(500).send({
          message:
            err.message || "Some error occurred while retrieving favourites."
        });
      else res.send(data);
    });
  };

// Delete a Favourite with the specified customerID and restaurantID in the request
exports.delete = (req, res) => {
    Favourite.remove(req.params.customer_ID, req.params.restaurant_ID,(err, data) => {
      if (err) {
        if (err.kind === "not_found") {
          res.status(404).send({
            message: `Not found Favourite with id ${req.params.customer_ID}.`
          });
        } else {
          res.status(500).send({
            message: "Could not delete Favourite with id " + req.params.customer_ID
          });
        }
      } else res.send({ message: `Favourite was deleted successfully!` });
    });
  };
