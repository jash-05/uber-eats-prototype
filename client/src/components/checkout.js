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
import { Link } from 'react-router-dom';
import FloatingLabel from 'react-bootstrap/esm/FloatingLabel';


// Define a Login Component
class CheckoutOrder extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            restaurant_ID: props.match.params.restaurant_ID,
            customer_ID: cookie.load('customer'),
            restaurant_name: "",
            selectedDishes: [],
            customer_addresses: [],
            order_info: {},
            selected_address_ID: 1,
            showModal: false,
            new_address: {}
        }
        //Bind the handlers to this class
        this.fetchCurrentOrder = this.fetchCurrentOrder.bind(this);
        this.placeOrder = this.placeOrder.bind(this);
        this.selectedAddressChangeHandler = this.selectedAddressChangeHandler.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.addressFieldsChangeHandler = this.addressFieldsChangeHandler.bind(this);
        this.addNewAddress = this.addNewAddress.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentDidMount(){
        this.fetchCurrentOrder();
        this.fetchCustomerAddresses(this.state.customer_ID);
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
                let selected_dishes = [];
                let total_order_amount = 0.0;
                for (let i=0; i<response.data.dishes.length;i++){
                    if (response.data.dishes[i].quantity > 0){
                        selected_dishes.push(response.data.dishes[i])
                        total_order_amount += (response.data.dishes[i].quantity 
                            * response.data.dishes[i].price)
                    }
                }
                let order_info = response.data;
                order_info.total_amount = Math.round(total_order_amount*100)/100;
                delete order_info["dishes"];
                this.setState({
                    order_info: order_info,
                    selectedDishes: selected_dishes
                });
            } else {
                console.log("Unsuccessful request");
                console.log(response);
            }
        } catch (err) {
            console.error(err);
        }
    }
    fetchCustomerAddresses = async (customer_ID) => {
        try {
            const response = await axios.get(`http://localhost:3001/customerAddress/${customer_ID}`)
            console.log("Fetched customer addresses")
            console.log("Status Code: ", response.status)
            if (response.status === 200) {
                console.log("Successful request")
                console.log(response.data)
                let selected_address_ID = 1
                for (let i=0;i<response.data.length;i++){
                    if(response.data[i].address_type==="primary"){
                        selected_address_ID = response.data[i].address_ID
                    }
                }   
                this.setState({
                    customer_addresses: response.data,
                    selected_address_ID: selected_address_ID
                })
            } else {
                console.log("Unsuccessful request");
                console.log(response);
            }
        } catch(err) {
            console.error(err)
        }
    }
    selectedAddressChangeHandler = (e) => {
        this.setState({
            selected_address_ID: this.state.customer_addresses[e.target.selectedIndex].address_ID
        })
    }
    toggleModal = () => {
        this.setState({
            showModal: !this.state.showModal
        })
    }
    addressFieldsChangeHandler = (e) => {
        let updated_address = this.state.new_address;
        updated_address[e.target.name] = e.target.value;
        this.setState({
            new_address: updated_address
        });
    }
    addNewAddress = async () => {
        let data = this.state.new_address;
        data['customer_ID'] = this.state.customer_ID;
        try {
            const response = await axios.post('http://localhost:3001/customerAddress', data);
            console.log("Status Code: ", response.status);
            if (response.status === 200){
                console.log("Successful request");
                console.log(response.data)
                this.setState({
                    showModal: !this.state.showModal,
                    new_address: {}
                })
            } else {
                console.log("Unsuccessful request");
                console.log(response);
            }
        } catch (err) {
            console.error(err)
        }
    }
    placeOrder = async () => {
        try {
            let data = {
                'order_ID': this.state.order_info.order_ID,
                'address_ID': this.state.selected_address_ID,
                'total_amount': this.state.order_info.total_amount,
                'order_type': sessionStorage.getItem("order_type")
            }
            const response = await axios.post('http://localhost:3001/placeOrder', data);
            console.log("Status Code: ", response.status);
            if (response.status === 200){
                console.log("Successful request");
                console.log(response.data)
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
        console.log(this.state.order_info)
        const createOrderItemRow = row => {
            return (
                <Row className="my-1">
                    <Col xs={1}> {row.quantity} </Col>
                    <Col xs={9}> {row.dish_name} </Col>
                    <Col xs={2}> {`$${Math.round(row.quantity * row.price * 100)/100}`} </Col>
                </Row>
            )
        }
        const createAddressCard = card => {
            return (
                <option>
                    {card.address_type.charAt(0).toUpperCase() + card.address_type.slice(1)}
                    {` (${card.line1}${card.line2}, ${card.city}, ${card.state_name} ${card.zipcode})`}
                </option>
            )
        }
        return(
            <Container fluid style={{height: "100vh"}}>
                <Row className="h-100">
                    <Col xs={7} className="p-5">
                        <Row className="h1 my-5">
                            Choose your delivery address
                        </Row>
                        <Row>
                            <FloatingLabel controlId="floatingSelect" label="You can choose any of your existing addresses">
                            <Form.Select size="md" onChange={this.selectedAddressChangeHandler}>
                                {this.state.customer_addresses.map(createAddressCard)}
                            </Form.Select>
                            </FloatingLabel>
                        </Row>
                        <Row className="mt-4 mx-5 px-5">
                            <Button variant="dark" onClick={this.toggleModal}>
                                Add a new address
                            </Button>
                            <Modal 
                                show={this.state.showModal} 
                                onHide={this.toggleModal}
                                backdrop="static"
                                keyboard={false}
                                centered
                            >
                                <Modal.Header closeButton>
                                <Modal.Title>Enter your new address</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <Form.Group className="mb-3" controlId="formGridAddressType">
                                        <Form.Label>Address Title</Form.Label>
                                        <Form.Control name="address_type" onChange={this.addressFieldsChangeHandler} placeholder="Eg: Work, Home, Friend" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formGridAddress1">
                                        <Form.Label>Street Address</Form.Label>
                                        <Form.Control name="line1" onChange={this.addressFieldsChangeHandler} placeholder="Eg: 1234 Main St" />
                                    </Form.Group>

                                    <Form.Group className="mb-3" controlId="formGridAddress2">
                                        {/* <Form.Label>Street Address Line 2 (optional)</Form.Label> */}
                                        <Form.Control name="line2" onChange={this.addressFieldsChangeHandler} placeholder="Apartment, studio, or floor (optional)" />
                                    </Form.Group>

                                    <Row className="mb-3">
                                        <Form.Group as={Col} controlId="formGridCity">
                                        <Form.Label>City</Form.Label>
                                        <Form.Control name="city" onChange={this.addressFieldsChangeHandler} />
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridState">
                                        <Form.Label>State</Form.Label>
                                        <Form.Control name="state_name" onChange={this.addressFieldsChangeHandler} />
                                        </Form.Group>

                                        <Form.Group as={Col} controlId="formGridZip">
                                        <Form.Label>Zip</Form.Label>
                                        <Form.Control name="zipcode" onChange={this.addressFieldsChangeHandler} type="number" />
                                        </Form.Group>
                                    </Row>
                                </Modal.Body>
                                <Modal.Footer>
                                    <Button className="mx-auto" variant="dark" onClick={this.addNewAddress}>
                                        Add address
                                    </Button>
                                </Modal.Footer>
                            </Modal>
                        </Row>
                    </Col>
                    <Col xs={5} className="p-5 h-100 d-flex flex-column" style={{backgroundColor: "#f4f4f4"}}>
                        <Container>
                            <Row className="h3 mt-5 mb-3">
                                <p>Order Details</p>
                            </Row>
                            {this.state.selectedDishes.map(createOrderItemRow)}
                            <Row className="mt-4 h5">
                                    <Col xs={1}></Col>
                                    <Col xs={9}>Total amount:</Col>
                                    <Col xs={2}> {`$${this.state.order_info.total_amount}`} </Col>
                            </Row>
                            <Row>
                                <Button className="mx-auto my-5" variant="success" onClick={this.placeOrder}>
                                            Place order
                                </Button>
                            </Row>
                        </Container>
                    </Col>
                </Row>
            </Container>
            
        )
    }
}



//export Login Component
export default CheckoutOrder;