import React, {Component} from 'react';
import './../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

// Define a Login Component
class RestaurantRegister extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            restaurant_name: "",
            owner_name: "",
            email: "",
            pass: "",
            country: "Select country",
            phone_number: ""
        }
        // //Bind the handlers to this class
        this.restaurantNameChangeHandler = this.restaurantNameChangeHandler.bind(this);
        this.ownerNameChangeHandler = this.ownerNameChangeHandler.bind(this);
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.countryChangeHandler = this.countryChangeHandler.bind(this);
        this.phoneNumberChangeHandler = this.phoneNumberChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }
    restaurantNameChangeHandler = (e) => {
        this.setState({
            restaurant_name: e.target.value
        })
    }
    ownerNameChangeHandler = (e) => {
        this.setState({
            owner_name: e.target.value
        })
    }
    emailChangeHandler = (e) => {
        this.setState({
            email: e.target.value
        })
    }
    countryChangeHandler = (e) => {
        this.setState({
            country: e
        })
    }
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }
    phoneNumberChangeHandler = (e) => {
        this.setState({
            phone_number: e.target.value
        })
    }

    //submit Login handler to send a request to the node backend
    submitLogin = (e) => {
        console.log(`Restaurant name: ${this.state.restaurant_name}, Owner name: ${this.state.owner_name}, Email: ${this.state.email}, Password: ${this.state.password}, Country: ${this.state.country}, Phone number: ${this.state.phone_number}`);
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            restaurant_name : this.state.restaurant_name,
            owner_name: this.state.owner_name,
            email_id: this.state.email,
            pass: this.state.password,
            country: this.state.country,
            phone_number: this.state.phone_number
        }
        console.log(data)
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/restaurants',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    console.log("Successful request");
                    console.log(response);
                    console.log('Cookie status: ', cookie.load('cookie'));
                } else{
                    console.log("Unsuccessful request");
                    console.log(response);
                }
            });
    }
    render(){
        return(
            <div>
                <Container className="mx-auto p-5">
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Uber_Eats_2020_logo.svg/1280px-Uber_Eats_2020_logo.svg.png" fluid/>                    
                </Container>
                <Container className="mt-5">
                    <Form>
                        <Form.Group className="mb-3" controlId="formBasicRestaurantName">
                            <Form.Label>Restaurant name</Form.Label>
                            <Form.Control onChange={this.restaurantNameChangeHandler} type="text" placeholder="Enter the name of your restaurant" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicOwnerName">
                            <Form.Label>Owner name</Form.Label>
                            <Form.Control onChange={this.ownerNameChangeHandler} type="text" placeholder="Enter your full name" />
                        </Form.Group>
                        
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control onChange={this.emailChangeHandler} type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control onChange={this.passwordChangeHandler} type="password" placeholder="Password" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicCountry">
                            <Form.Label>Country</Form.Label>
                            <DropdownButton onSelect={this.countryChangeHandler} className="mb-3" id="dropdown-basic-button" size="sm" title={this.state.country}>
                                <Dropdown.Item eventKey="USA">USA</Dropdown.Item>
                                <Dropdown.Item eventKey="Canada">Canada</Dropdown.Item>
                                <Dropdown.Item eventKey="Mexico">Mexico</Dropdown.Item>
                            </DropdownButton>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
                            <Form.Label>Phone Number</Form.Label>
                            <Form.Control onChange={this.phoneNumberChangeHandler} type="number" placeholder="Enter your 10-digit phone number" />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button onClick={this.submitLogin} variant="primary" type="submit">
                                Add your restaurant
                            </Button>
                        </div>
                    </Form>
                </Container>
            </div>
        )
    }
}
//export Login Component
export default RestaurantRegister;