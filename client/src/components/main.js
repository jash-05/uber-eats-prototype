import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import CustomerLogin from './customer.login';
import CustomerRegister from './customer.register';
import RestaurantLogin from './restaurant.login';
import RestaurantRegister from './restaurant.register';
import Dashboard from './dashboard';

//Create a Main Component
class Main extends Component {
    render(){
        return(
            <div>
                {/*Render Different Component based on Route*/}
                <Route path="/" component={CustomerRegister}/>
                <Route path="customerLogin" component={CustomerLogin}/>
                <Route path="customerRegister" component={CustomerRegister}/>
                <Route path="/restaurantLogin" component={RestaurantLogin}/>
                <Route path="/restaurantRegister" component={RestaurantRegister}/>
            </div>
        )
    }
}

//Export The Main Component
export default Main;