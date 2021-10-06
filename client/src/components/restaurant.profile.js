import React, {Component} from 'react';
import './../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import Button from 'react-bootstrap/Button';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Modal from 'react-bootstrap/Modal';
import { Link, Redirect } from 'react-router-dom';
import Tabs from 'react-bootstrap/Tabs';
import Tab from 'react-bootstrap/Tab';
import Nav from 'react-bootstrap/Nav';
import Dropdown from 'react-bootstrap/Dropdown';
import DropdownButton from 'react-bootstrap/DropdownButton';
import ReactS3 from 'react-s3';
import s3_config from '../config/s3.config.js';
import { object } from 'prop-types';

// Define a Login Component
class RestaurantProfile extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            restaurant_ID: null,
            customer_ID: 13,
            const_restaurant_name: "",
            restaurant_name: "",
            owner_name: "",
            line1: "",
            line2: "",
            city: "",
            state_name: "",
            zipcode: "",
            phone_number: "",
            vegetarian: false,
            non_vegetarian: false,
            vegan: false,
            delivery: false,
            pickup: false,
            short_address: "",
            cover_image: "",
            const_cover_image: "",
            about: "",
            full_adress: "",
            fetchedDishes: [],
            cover_image_file: ""
        }
        //Bind the handlers to this class
        this.setRestaurantState = this.setRestaurantState.bind(this);
        this.fetchRestaurantDetails = this.fetchRestaurantDetails.bind(this);
        this.fetchDishes = this.fetchDishes.bind(this);
        this.restaurantNameChangeHandler = this.restaurantNameChangeHandler.bind(this);
        this.ownerNameChangeHandler = this.ownerNameChangeHandler.bind(this);
        this.addressLine1ChangeHandler = this.addressLine1ChangeHandler.bind(this);
        this.addressLine2ChangeHandler = this.addressLine2ChangeHandler.bind(this);
        this.cityChangeHandler = this.cityChangeHandler.bind(this);
        this.stateChangeHandler = this.stateChangeHandler.bind(this);
        this.zipChangeHandler = this.zipChangeHandler.bind(this);
        this.phoneNumberChangeHandler = this.phoneNumberChangeHandler.bind(this);
        this.vegetarianChangeHandler = this.vegetarianChangeHandler.bind(this);
        this.nonVegetarianChangeHandler = this.nonVegetarianChangeHandler.bind(this);
        this.veganChangeHandler = this.veganChangeHandler.bind(this);
        this.deliveryChangeHandler = this.deliveryChangeHandler.bind(this);
        this.pickupChangeHandler = this.pickupChangeHandler.bind(this);
        this.coverImageChangeHandler = this.coverImageChangeHandler.bind(this);
        this.submitUpdate = this.submitUpdate.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentDidMount(){
        this.setRestaurantState();
        this.fetchRestaurantDetails();
        this.fetchDishes();
    }
    setRestaurantState = async () => {
        if (cookie.load('restaurant')) {
            this.setState({
                restaurant_ID: cookie.load('restaurant')
            })
        }
    }
    fetchRestaurantDetails = async () => {
        try {
            await this.setRestaurantState();
            console.log('Fetching restaurant details')
            const response = await axios.get(`http://localhost:3001/restaurants/${this.state.restaurant_ID}`);
            console.log("Status Code : ",response.status);
            if(response.status === 200){
                console.log("Successful request");
                console.log(response.data);
                this.setState({
                    const_restaurant_name: response.data.restaurant_name,
                    restaurant_name: response.data.restaurant_name,
                    short_address: `${response.data.line1} ${response.data.line2}`,
                    full_address: `${response.data.line1} ${response.data.line2}, ${response.data.city}, ${response.data.state_name} ${response.data.zipcode}`,
                    const_cover_image: response.data.cover_image,
                    cover_image: response.data.cover_image,
                    about: response.data.about,
                    owner_name: response.data.owner_name,
                    line1: response.data.line1,
                    line2: response.data.line2,
                    city: response.data.city,
                    state_name: response.data.state_name,
                    zipcode: response.data.zipcode,
                    phone_number: response.data.phone_number,
                    vegetarian: ((response.data.vegetarian===1) ? true : false),
                    non_vegetarian: ((response.data.non_vegetarian===1) ? true : false),
                    vegan: ((response.data.vegan===1) ? true : false),
                    delivery: ((response.data.delivery===1) ? true : false),
                    pickup: ((response.data.pickup===1) ? true : false) 
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
    fetchDishes = async () => {
        let dishesData = [] 
        try {
            await this.setRestaurantState();
            console.log('Fetching dishes')
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
                        "dish_image": response.data[i].dish_image,
                        "quantity": 0
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
    addressLine1ChangeHandler = (e) => {
        this.setState({
            line1: e.target.value
        })
    }
    addressLine2ChangeHandler = e => {
        this.setState({
            line2: e.target.value
        })
    }
    cityChangeHandler = e => {
        this.setState({
            city: e.target.value
        })
    }
    stateChangeHandler = e => {
        this.setState({
            state_name: e.target.value
        })
    }
    zipChangeHandler = e => {
        this.setState({
            zipcode: e.target.value
        })
    }
    phoneNumberChangeHandler = (e) => {
        this.setState({
            phone_number: e.target.value
        })
    }
    vegetarianChangeHandler = (e) => {
        this.setState({
            vegetarian: e.target.checked
        })
    }
    nonVegetarianChangeHandler = e => {
        this.setState({
            non_vegetarian: e.target.checked
        })
    }
    veganChangeHandler = e => {
        this.setState({
            vegan: e.target.checked
        })
    }
    deliveryChangeHandler = e => {
        this.setState({
            delivery: e.target.checked
        })
    }
    pickupChangeHandler = e => {
        this.setState({
            pickup: e.target.checked
        })
    }
    coverImageChangeHandler = e => {
        const file = e.target.files[0]
        console.log(e.target.files[0])
        this.setState({
            cover_image_file: file
        })

    }
    uploadImageToS3 = async () => {
        if (this.state.cover_image_file){
            try {
                const data = await ReactS3.uploadFile(this.state.cover_image_file, s3_config)
                this.setState({
                    cover_image: data.location
                })
            } catch (err) {
                console.error(err);
            }
            
        }
    }
    
    submitUpdate = async (e) => {
        //prevent page from refresh
        e.preventDefault();

        await this.uploadImageToS3()

        const restaurant_data = {
            restaurant_ID: this.state.restaurant_ID,
            restaurant_name : this.state.restaurant_name,
            owner_name: this.state.owner_name,
            phone_number: this.state.phone_number,
            vegetarian: this.state.vegetarian,
            non_vegetarian: this.state.non_vegetarian,
            vegan: this.state.vegan,
            delivery: this.state.delivery,
            pickup: this.state.pickup,
            cover_image: this.state.cover_image
        }
        console.log(restaurant_data)
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        // make a post request with the user data
        axios.put(`http://localhost:3001/restaurants/${this.state.restaurant_ID}`,restaurant_data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    console.log("Successful request for storing restaurant info");
                    console.log(response);
                    console.log('Cookie status: ', cookie.load('cookie'));
                    const address_data = {
                        restaurant_ID: this.state.restaurant_ID,
                        line1: this.state.line1,
                        line2: this.state.line2,
                        city: this.state.city,
                        state_name: this.state.state_name,
                        zipcode: this.state.zipcode
                    }
                    axios.put('http://localhost:3001/restaurantAddress', address_data)
                    .then(resp => {
                        console.log("Status Code: ", resp.status);
                        if (resp.status === 200) {
                            console.log("Successful request for storing restaurant address");
                            console.log(resp);
                            this.fetchRestaurantDetails();
                        } else {
                            console.log("Unsuccessful request for storing restaurant address");
                            console.log(resp)
                        }
                    })
                } else{
                    console.log("Unsuccessful request for storing restaurant info");
                    console.log(response);
                }
            });
    }
    render(){
        console.log("Rendering")
        console.log(this.state.vegetarian)
        console.log(this.state.non_vegetarian)
        console.log(this.state.vegan)
        let redirectVar = null;
        if (!cookie.load('restaurant')){
            redirectVar = <Redirect to="/restaurantLogin"/>
        }
        const createCard = card => {
            return (
                <Col sm={3} className="m-3  border"  style={{ width: '32rem', height:'12rem'}}>
                    <Row className="p-2">
                        <Col xs={9} md={8}>
                            <Row className="h5 mt-2 mb-4">{card.dish_name}</Row>
                            <Row className="text-muted">{card.main_ingredients}</Row>
                            <Row className="my-4 px-2">${card.price}</Row>
                        </Col>
                        <Col xs={3} md={4}>
                            <Image src={card.dish_image} className="img-fluid" style={{height: '8rem'}} />
                        </Col>
                    </Row>
                  </Col>
            )
        }
        return(
            <Container>
                {redirectVar}
                <Container>
                    <Row>
                        <Col xs={10}>
                            <Image src={this.state.const_cover_image} style={{ width: '85rem', height: '20rem', objectFit:'cover'}}></Image>
                        </Col>
                    </Row>
                    <Row className="h2">
                        {`${this.state.const_restaurant_name} (${this.state.short_address})`}
                    </Row>
                    <Row>
                        {`${this.state.about}`}
                    </Row>
                    <Row>
                        {`${this.state.full_address}`}
                    </Row>
                </Container>
                <Container className="my-5">
                    <Tabs defaultActiveKey="first">
                        <Tab eventKey="first" title="Profile">
                            <Container className="mt-5">
                                <Form>
                                    <Form.Group className="mb-3" controlId="formBasicRestaurantName">
                                        <Form.Label>Restaurant name</Form.Label>
                                        <Form.Control onChange={this.restaurantNameChangeHandler} type="text" defaultValue={this.state.restaurant_name} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicOwnerName">
                                        <Form.Label>Owner name</Form.Label>
                                        <Form.Control onChange={this.ownerNameChangeHandler} type="text" defaultValue={this.state.owner_name} />
                                    </Form.Group>
                                    
                                    <Form.Group className="mb-3" controlId="formGridAddress1">
                                        <Form.Label>Street Address</Form.Label>
                                        <Form.Control onChange={this.addressLine1ChangeHandler} defaultValue={this.state.line1} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formGridAddress2">
                                        {/* <Form.Label>Street Address Line 2 (optional)</Form.Label> */}
                                        <Form.Control onChange={this.addressLine2ChangeHandler} defaultValue={this.state.line2} />
                                    </Form.Group>

                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="formGridCity">
                                        <Form.Label>City</Form.Label>
                                        <Form.Control onChange={this.cityChangeHandler} defaultValue={this.state.city}/>
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridState">
                                        <Form.Label>State</Form.Label>
                                        <Form.Control onChange={this.stateChangeHandler} defaultValue={this.state.state_name}/>
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridZip">
                                        <Form.Label>Zip</Form.Label>
                                        <Form.Control onChange={this.zipChangeHandler} type="number" defaultValue={this.state.zipcode}/>
                                        </Form.Group>
                                    </Row>

                                    <Form.Group className="mb-3" controlId="formBasicPhoneNumber">
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control onChange={this.phoneNumberChangeHandler} type="number" defaultValue={this.state.phone_number} />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicFoodOptions">
                                        <Form.Label>Food Options</Form.Label>
                                        <div key="inline-checkbox" className="mb-3">
                                        <Form.Check
                                            onChange={this.vegetarianChangeHandler}
                                            inline
                                            label="Vegetarian"
                                            name="group1"
                                            type="checkbox"
                                            id="inline-checkbox-1"
                                            {...this.state.vegetarian && {'defaultChecked': 'true'}}
                                        />
                                        {/* {console.log(this.state.vegetarian)}
                                        {console.log(this.state.non_vegetarian)}
                                        {console.log(this.state.vegan)} */}
                                        <Form.Check
                                            onChange= {this.nonVegetarianChangeHandler}
                                            inline
                                            label="Non-Vegetarian"
                                            name="group1"
                                            type="checkbox"
                                            id="inline-checkbox-2"
                                            {...this.state.non_vegetarian && {'defaultChecked': 'true'}}
                                        />
                                        <Form.Check
                                            inline
                                            label="Vegan"
                                            name="group1"
                                            type="checkbox"
                                            id="inline-checkbox-3"
                                            {...this.state.vegan && {'defaultChecked': 'true'}}
                                            onChange={this.veganChangeHandler}
                                        />
                                        </div>
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formBasicDeliveryOptions">
                                        <Form.Label>Delivery Options</Form.Label>
                                        <div key="inline-checkbox" className="mb-3">
                                        <Form.Check
                                            onChange={this.deliveryChangeHandler}
                                            inline
                                            label="Delivery"
                                            name="group1"
                                            type="checkbox"
                                            id="inline-checkbox-4"
                                            {...this.state.delivery && {'defaultChecked': 'true'}}
                                        />
                                        <Form.Check
                                            onChange={this.pickupChangeHandler}
                                            inline
                                            label="Pickup"
                                            name="group1"
                                            type="checkbox"
                                            id="inline-checkbox-5"
                                            {...this.state.pickup && {'defaultChecked': 'true'}}
                                        />
                                        </div>
                                    </Form.Group>                
                                    
                                    <Form.Group controlId="formCoverImage" className="mb-3">
                                        <Form.Label>Update your cover image</Form.Label>
                                        <Form.Control onChange={this.coverImageChangeHandler} type="file" />
                                    </Form.Group>

                                    <div className="d-grid gap-2 mb-5">
                                        <Button onClick={this.submitUpdate} variant="dark" type="submit">
                                            Save
                                        </Button>
                                    </div>
                                </Form>
                            </Container>
                        </Tab>
                        <Tab eventKey="second" title="Menu">
                            <Container className="my-5">
                            </Container>
                            <Row className="my-5">
                                {this.state.fetchedDishes.map(createCard)}
                            </Row>
                        </Tab>
                        <Tab eventKey="third" title="Orders">
                            <Container className="my-5">
                                View my orders
                            </Container>
                        </Tab>
                    </Tabs>
                </Container>
                {/* <Container>
                    <Row>
                        {this.state.fetchedDishes.map(createCard)}
                    </Row>
                </Container> */}
            </Container>
            
        )
    }
}



//export Login Component
export default RestaurantProfile;