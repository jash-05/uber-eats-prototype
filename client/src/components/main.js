import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import WelcomeUser from './welcome.user'
import CustomerLogin from './customer.login';
import CustomerRegister from './customer.register';
import RestaurantLogin from './restaurant.login';
import RestaurantRegister from './restaurant.register';
import Dashboard from './dashboard';
import DashboardNavbar from './navbar';
import RestaurantDetails from './restaurant.details';

//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                {/* <Route path="/" component={DashboardNavbar}/> */}
                <Route path="/welcomeUser" component={WelcomeUser}/>
                <Route path="/customerLogin" component={CustomerLogin}/>
                <Route path="/customerRegister" component={CustomerRegister}/>
                <Route path="/restaurantLogin" component={RestaurantLogin}/>
                <Route path="/restaurantRegister" component={RestaurantRegister}/>
                <Route path="/dashboard" component={Dashboard}/>
                <Route path="/restaurants/:restaurant_ID" component={RestaurantDetails}/>
            </div>
        )
    }
}



//Export The Main Component
export default Main;