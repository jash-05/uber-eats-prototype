module.exports = app => {
    const customer_addresses = require("../controllers/customer_address.controller.js");
  
    // Create a new customer address
    app.post("/customerAddress", customer_addresses.create);
  
    // Retrieve all customer addresses
    app.get("/customerAddress/:customer_ID", customer_addresses.findAll);
  
    // Delete an address for a customer
    app.delete("/customerAddress/:customer_ID/:address_type", customer_addresses.delete);
  };