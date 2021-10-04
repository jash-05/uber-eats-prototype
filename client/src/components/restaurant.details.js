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

// Define a Login Component
class RestaurantDetails extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            restaurant_ID: props.match.params.restaurant_ID,
            customer_ID: 13,
            restaurant_name: "",
            short_address: "",
            cover_image: "",
            about: "",
            full_adress: "",
            fetchedDishes: [],
            order_info: {}
        }
        //Bind the handlers to this class
        this.stateChangeHandler = this.stateChangeHandler.bind(this);
        this.updateQuantityHandler = this.updateQuantityHandler.bind(this);
        this.fetchRestaurantDetails = this.fetchRestaurantDetails.bind(this);
        this.fetchDishes = this.fetchDishes.bind(this);
        this.fetchCurrentOrder = this.fetchCurrentOrder.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentDidMount(){
        this.fetchRestaurantDetails();
        this.fetchDishes();
        this.fetchCurrentOrder();
    }
    stateChangeHandler = (stateName, stateValue) => {
        console.log(stateName, stateValue)
        this.setState({
            stateName: stateValue
        })
    }
    updateQuantityHandler = async (e) => {
        console.log("Update quantity handler")
        let to_add = 0
        if (e.target.innerText === "+"){
            to_add = 1
        } else {
            to_add = -1
        }
        let quantity = parseInt(e.target.parentNode.parentNode.childNodes[1].lastChild.data)
        let dish_ID = parseInt(e.target.parentNode.parentNode.childNodes[1].childNodes[0].childNodes[0].data)

        let data = {
            order_ID: this.state.order_info.order_ID,
            dish_ID: dish_ID,
            quantity: Math.max(quantity + to_add, 0),
            restaurant_ID: this.state.restaurant_ID,
            customer_ID: this.state.customer_ID
        }
        try {
            await this.addItemToOrder(data);
            try {
                await this.fetchCurrentOrder();
            } catch (err) {
                console.error(err);
            }
        } catch (err) {
            console.error(err);
        }
    }
    addItemToOrder = async (data) => {
        try {
            const response  = await axios.post('http://localhost:3001/addOrderItem', data);
            console.log("Status Code: ", response.status);
            if (response.status === 200){
                console.log("Successful request");
            } else {
                console.log("Unsuccessful request");
                console.log(response);
            }   
        } catch (err) {
            console.error(err)
        }
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
    fetchCurrentOrder = async () => {
        try {
            console.log("Fetching current order")
            const response = await axios.get('http://localhost:3001/getOrderDetails', {
                params: {
                    restaurant_ID: this.state.restaurant_ID,
                    customer_ID: this.state.customer_ID
                }
            })
            console.log("Status Code: ", response.status);
            if (response.status === 200){
                console.log("Successful request");
                console.log(response.data);
                let prev_state = this.state.fetchedDishes
                let new_state = []
                for (let i=0; i<prev_state.length;i++){
                    let matchedDish = response.data.dishes.filter(x => x.dish_ID === prev_state[i].dish_ID)
                    if(matchedDish.length>0){
                        prev_state[i].quantity = matchedDish[0].quantity
                    }
                    new_state.push(prev_state[i])
                }
                let order_info = response.data
                delete order_info["dishes"]
                this.setState({
                    order_info: order_info,
                    fetchedDishes: new_state
                });
            } else {
                console.log("Unsuccessful request");
                console.log(response);
            }
        } catch (err) {
            console.error(err);
        }
    }
    render(){
        console.log("Rendering")
        const createCard = card => {
            return (
                <Col sm={3} className="m-3  border"  style={{ width: '32rem', height:'12rem'}}>
                    <Row className="p-2">
                        <Col xs={9} md={8}>
                            <Row className="h5 mt-2 mb-4">{card.dish_name}</Row>
                            <Row className="text-muted">{card.main_ingredients}</Row>
                        </Col>
                        <Col xs={3} md={4}>
                            <Image src={card.dish_image} className="img-fluid" style={{height: '8rem'}} />
                            <Row className="mt-1">
                                <Col>
                                    <Button onClick={this.updateQuantityHandler} size="md" variant="dark">-</Button>
                                </Col>
                                <Col className="h6 my-auto">
                                    <Form.Label visuallyHidden>{card.dish_ID}</Form.Label>
                                    {card.quantity}
                                </Col>
                                <Col>
                                    <Button onClick={this.updateQuantityHandler} size="md" variant="dark">+</Button>
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