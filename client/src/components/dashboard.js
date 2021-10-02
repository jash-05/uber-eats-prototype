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


// Define a Login Component
class Dashboard extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            fetchedRestaurants: [],
            vegetarian: false,
            non_vegetarian: false,
            vegan: false,
            delivery: true,
            pickup: false,
            authFlag : false
        }
        //Bind the handlers to this class
        this.vegetarianChangeHandler = this.vegetarianChangeHandler.bind(this);
        this.nonVegetarianChangeHandler = this.nonVegetarianChangeHandler.bind(this);
        this.veganChangeHandler = this.veganChangeHandler.bind(this);
        this.deliveryOptionsChangeHandler = this.deliveryOptionsChangeHandler.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
        })
        const data  = {
            vegetarian: this.state.vegetarian,
            non_vegetarian: this.state.non_vegetarian,
            vegan: this.state.vegan,
            delivery: this.state.delivery,
            pickup: this.state.pickup
        }
        this.fetchRestaurants(data);
    }
    vegetarianChangeHandler = async (e) => {
        const data  = {
            vegetarian: !this.state.vegetarian,
            non_vegetarian: this.state.non_vegetarian,
            vegan: this.state.vegan,
            delivery: this.state.delivery,
            pickup: this.state.pickup
        }
        try {
            await this.fetchRestaurants(data);
            this.setState({
                vegetarian: !this.state.vegetarian
            })
        } catch(err) {
            console.error(err);
        }
    }
    nonVegetarianChangeHandler = async (e) => {
        const data  = {
            vegetarian: this.state.vegetarian,
            non_vegetarian: !this.state.non_vegetarian,
            vegan: this.state.vegan,
            delivery: this.state.delivery,
            pickup: this.state.pickup
        }
        try {
            await this.fetchRestaurants(data);
            this.setState({
                non_vegetarian: !this.state.non_vegetarian
            })
        } catch(err) {
            console.error(err);
        }
    }
    veganChangeHandler = async (e) => {
        const data  = {
            vegetarian: this.state.vegetarian,
            non_vegetarian: this.state.non_vegetarian,
            vegan: !this.state.vegan,
            delivery: this.state.delivery,
            pickup: this.state.pickup
        }
        try {
            await this.fetchRestaurants(data);
            this.setState({
                vegan: !this.state.vegan
            })
        } catch(err) {
            console.error(err);
        }
    }
    deliveryOptionsChangeHandler = async (e) => {
        const data  = {
            vegetarian: this.state.vegetarian,
            non_vegetarian: this.state.non_vegetarian,
            vegan: this.state.vegan,
            delivery: e,
            pickup: !e
        }
        try {
            await this.fetchRestaurants(data);
            this.setState({
                delivery: e,
                pickup: !e
            })
        } catch(err) {
            console.error(err);
        }
    }
    fetchRestaurants = async (data) => {
        let restaurantData = [] 
        console.log("printing data");
        console.log(data);
        try {
            const response = await axios.get('http://localhost:3001/restaurants', {params:data})
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log("Successful request");
                console.log(response.data);
                for (let i=0;i < response.data.length; i++){
                    restaurantData.push({
                        'restaurant_ID': response.data[i].restaurant_ID,
                        'restaurant_name': response.data[i].restaurant_name,
                        'cover_image': response.data[i].cover_image
                    });
                    console.log(restaurantData)
                }
                this.setState({
                    fetchedRestaurants: restaurantData
                })
                console.log('Cookie status: ', cookie.load('cookie'));
            } else{
                console.log("Unsuccessful request");
                console.log(response);
            }
        } catch (err) {
            console.error(err);
        }
    }
    render(){
        console.log(this.state.fetchedRestaurants)
        const createCard = card => {
            return (
                <Col sm={3} className="ml-3 mt-3"  style={{ width: '15rem' }}>
                <Link to={`/restaurants/${card.restaurant_ID}`} style={{textDecoration: 'none'}}>
                    <Card>
                    <Card.Img variant="top" src={card.cover_image} />
                    <Card.Body>
                        <Card.Title className="text-dark">{card.restaurant_name}</Card.Title>
                        <Card.Text>
                              {/* {card.restaurant_address} */}
                        </Card.Text>
                    </Card.Body>
                    </Card>
                </Link>
                  </Col>
            )
        }
        let veg_btn_variant = this.state.vegetarian ? "dark" : "light";
        let non_veg_btn_variant = this.state.non_vegetarian ? "dark" : "light";
        let vegan_btn_variant = this.state.vegan ? "dark" : "light";

        return(
            <Container>
                <Row className="m-4">
                    <Col xs={3} >
                        <Container className="my-5">
                            <Row>
                                <p className="h4">Food options</p>
                            </Row>
                            <Row>
                                <Button onClick={this.vegetarianChangeHandler} className="m-2" variant={veg_btn_variant}>Vegetarian</Button>
                                <Button onClick={this.nonVegetarianChangeHandler} className="m-2" variant={non_veg_btn_variant}>Non-vegetarian</Button>
                                <Button onClick={this.veganChangeHandler} className="m-2" variant={vegan_btn_variant}>Vegan</Button>
                            </Row>
                        </Container>
                        <Container className="my-5">
                            <Row>
                                <p className="h4">Select delivery option</p>
                                <p className="h6">(Click to toggle)</p>
                            </Row>
                            <Row>
                                <BootstrapSwitchButton 
                                    checked={this.state.delivery}
                                    onlabel='Delivery'
                                    offlabel='Pickup'
                                    onChange={this.deliveryOptionsChangeHandler}
                                />
                            </Row>
                        </Container>
                    </Col>
                    <Col xs={9}>
                      <Container>
                          <Row>
                          {this.state.fetchedRestaurants.map(createCard)}
                          </Row>
                      </Container>
                    </Col>
                </Row>
            </Container>
        )
    }
}



//export Login Component
export default Dashboard;