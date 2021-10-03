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
import Card from 'react-bootstrap/Card';
import Badge from 'react-bootstrap/Badge';
import BootstrapSwitchButton from 'bootstrap-switch-button-react'
import { Link } from 'react-router-dom';
import { Carousel } from 'bootstrap';

// Define a Login Component
class RestaurantDetails extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            restaurant_ID: props.match.params.restaurant_ID,
            restaurant_name: "",
            short_address: "",
            cover_image: "",
            about: "",
            full_adress: "",
            fetchedDishes: []
        }
        //Bind the handlers to this class
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.fetchRestaurantDetails();
    }
    stateChangeHandler(stateName, stateValue){
        console.log(stateName, stateValue)
        this.setState({
            stateName: stateValue
        })
    }
    fetchRestaurantDetails = async () => {
        try {
            const response = await axios.get(`http://localhost:3001/restaurants/${this.state.restaurant_ID}`);
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log("Successful request");
                console.log(response.data);
                this.setState({restaurant_name: response.data.restaurant_name});
                this.setState({
                    short_address: `${response.data.line1} ${response.data.line2}`
                });
                this.setState({
                    full_address: `${response.data.line1} ${response.data.line2}, ${response.data.city}, ${response.data.state_name} ${response.data.zipcode}`
                })
                this.setState({cover_image: response.data.cover_image});
                this.setState({about: response.data.about});
                console.log('Cookie status: ', cookie.load('cookie'));
            } else{
                console.log("Unsuccessful request");
                console.log(response);
            }
        } catch (err) {
            console.error(err);
        }
    }
    fetchDishes = async (data) => {
    }
    render(){
        console.log("Cover image")
        console.log(this.state.cover_image)
        return(
            <Container>
            <Row>
                <Col></Col>
                <Col xs={10}>
                    <Image src={this.state.cover_image}></Image>
                </Col>
                <Col></Col>
            </Row>
            <Row className="h2">
                {`${this.state.restaurant_name} (${this.state.short_address})`}
            </Row>
            <Row>
                {`${this.state.about}`}
            </Row>
            <Row>
                {`${this.state.full_address}`}
            </Row>
            </Container>
        )
    }
}



//export Login Component
export default RestaurantDetails;