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
        this.fetchDishes();
        this.fetchCurrentOrder();
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
    fetchDishes = async () => {
        let dishesData = [] 
        try {
            const response = await axios.get('http://localhost:3001/dish', {params:{restaurant_ID: this.state.restaurant_ID}})
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log("Successful request");
                console.log(response.data);
                for (let i=0;i < response.data.length; i++){
                    let main_ingredients = response.data[i].main_ingredients;
                    if (main_ingredients.length > 20) {
                        main_ingredients = main_ingredients.slice(0,80).concat('...')
                    }
                    dishesData.push({
                        'dish_ID': response.data[i].dish_ID,
                        'dish_name': response.data[i].dish_name,
                        'category_ID': response.data[i].category_ID,
                        'main_ingredients': main_ingredients,
                        'price': response.data[i].price,
                        'about': response.data[i].about,
                        "dish_image": response.data[i].dish_image
                    });
                }
                this.setState({
                    fetchedDishes: dishesData
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
    fetchCurrentOrder = async () => {
        console.log("Fetched dishes: ")
        console.log(this.state.fetchedDishes)
    }
    render(){
        console.log("Fetched dishes")
        console.log(this.state.fetchedDishes)
        const createCard = card => {
            return (
                <Col sm={3} className="m-3  border"  style={{ width: '30rem', height:'12rem'}}>
                    <Row className="p-2">
                        <Col xs={9} md={8}>
                            <Row className="h5 mt-2 mb-4">{card.dish_name}</Row>
                            <Row className="text-muted">{card.main_ingredients}</Row>
                        </Col>
                        <Col xs={3} md={4}>
                            <Image src={card.dish_image} className="img-fluid" style={{height: '8rem'}} />
                            <Row className="mt-1">
                                <Col>
                                    <Button size="md" variant="dark">-</Button>
                                </Col>
                                <Col className="h5 my-auto">
                                    5
                                </Col>
                                <Col>
                                    <Button size="md" variant="dark">+</Button>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                  </Col>
            )
        }
        return(
            <Container>
                <Container>
                    <Row>
                        <Col xs={10}>
                            <Image src={this.state.cover_image} style={{ width: '85rem', height: '20rem'}}></Image>
                        </Col>
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
                <Container>
                    <Row>
                        {this.state.fetchedDishes.map(createCard)}
                    </Row>
                </Container>
            </Container>
        )
    }
}



//export Login Component
export default RestaurantDetails;