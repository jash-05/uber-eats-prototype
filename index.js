const express = require('express');
const bodyParser = require('body-parser');

const app = express();

var session = require('express-session');
var cookieParser = require('cookie-parser');
const { Session } = require('express-session');

app.set('view engine', 'ejs');
app.set('views','./views')
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
    secret: 'cmpe_273_secure_string',
    resave: false,
    saveUninitialized: true
}));

app.get('/', (req, res) => {
    res.json({
        message: 'Welcome to my uber eats application!'
    });
})

app.get('/login',(req, res) => {
    res.render('login');
});

require("./routes/customer.routes.js")(app);
require("./routes/restaurant.routes.js")(app);
require("./routes/favourite.routes.js")(app);
require("./routes/customer_address.routes.js")(app);

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});