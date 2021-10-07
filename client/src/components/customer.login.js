import React, {Component} from 'react';
import './../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Container from 'react-bootstrap/Container';
import Image from 'react-bootstrap/Image';

// Define a Login Component
class CustomerLogin extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            email: "",
            password: "",
            authFlag: false,
            loginStatus: ""
        }
        // //Bind the handlers to this class
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
        })
        console.log('Cookie status: ', cookie.load('cookie'));
    }
    emailChangeHandler = (e) => {
        this.setState({
            email: e.target.value
        })
    }
    passwordChangeHandler = (e) => {
        this.setState({
            password: e.target.value
        })
    }

    //submit Login handler to send a request to the node backend
    submitLogin = (e) => {
        console.log(`Email: ${this.state.email}, Password: ${this.state.password}`)
        // var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            email_id: this.state.email,
            pass: this.state.password
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/customer',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    console.log("Successful request");
                    console.log(response);
                    console.log('Cookie status: ', cookie.load('cookie'));
                    this.setState({
                        authFlag : true
                    })
                } else{
                    console.log("Unsuccessful request");
                    console.log(response);
                }
            });
    }
    render(){
        console.log('RENDERING')
        let redirectVar = null;
        if(cookie.load('customer')){
            redirectVar = <Redirect to= "/dashboard"/>
        } else {
            redirectVar = <Redirect to="/customerLogin"/>
        }
        return(
            <div>
                    {redirectVar}
                <Container className="mx-auto p-5">
                    <Image src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Uber_Eats_2020_logo.svg/1280px-Uber_Eats_2020_logo.svg.png" fluid/>                    
                </Container>
                <Container className="mt-5">
                    <Form>
                        
                        <Form.Group className="mb-3" controlId="formBasicEmail">
                            <Form.Label>Email address</Form.Label>
                            <Form.Control onChange={this.emailChangeHandler} type="email" placeholder="Enter email" />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="formBasicPassword">
                            <Form.Label>Password</Form.Label>
                            <Form.Control onChange={this.passwordChangeHandler} type="password" placeholder="Password" />
                        </Form.Group>

                        <div className="d-grid gap-2">
                            <Button onClick={this.submitLogin} variant="primary" type="submit">
                                Login to your account
                            </Button>
                        </div>
                    </Form>
                </Container>
            </div>
        )
    }
}
//export Login Component
export default CustomerLogin;