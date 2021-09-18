const Favourite = require("../models/favourite.model.js");

// Create and Save a new Favourite
exports.create = (req, res) => {
    // Validate request
    if (!req.body) {
      res.status(400).send({
        message: "Content can not be empty!"
      });
    }

    // Create object of input variables
    let favourite_dict = {
        'customer_ID': req.body.customer_ID,
        'restaurant_ID': req.body.restaurant_ID
    };

    // Save Favourite in the database
    Favourite.createFavouriteForCustomer(favourite_dict, (err, data) => {  
      if (err)
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Favourite."
        });
      else res.send(data);
    });
  };

// Retrieve all Favourites from the database.
exports.findAll = (req, res) => {
    Favourite.getFavouritesForCustomer(req.params.customer_ID, (err, data) => {
      if (err)
        res.status(500).send({
          message: err.message || "Some error occurred while retrieving favourites."
        });
      else res.send(data);
    });
  };

// Delete a Favourite with the specified customer_ID and restaurant_ID in the request
exports.delete = (req, res) => {
    Favourite.removeRestaurantFromFavourites(req.params.customer_ID, req.params.restaurant_ID,(err, data) => {
      if (err) {
        if (err.err_type === "not_found") {
          res.status(404).send({
            message: `Could not find restaurant ${req.params.restaurant_ID} in favourites of customer ${req.params.customer_ID}.`
          });
        } else {
          res.status(500).send({
            message: `Could not delete restaurant ${req.params.restaurant_ID} from favourites of customer ${req.params.customer_ID}.`
          });
        }
      } else res.send({ 
          message: `Favourite restaurant ${req.params.restaurant_ID} was deleted successfully for customer ${req.params.customer_ID}!` });
    });
  };
