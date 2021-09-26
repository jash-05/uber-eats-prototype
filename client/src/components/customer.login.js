import React, {Component} from 'react';
import './../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import Button from 'react-bootstrap/Button';

// Define a Login Component
class Login extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            email_ID : "",
            password : "",
            authFlag : false,
            loginStatus: ""
        }
        //Bind the handlers to this class
        this.usernameChangeHandler = this.usernameChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
        })
    }
    //username change handler to update state variable with the text entered by the user
    usernameChangeHandler = (e) => {
        this.setState({
            username : e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password : e.target.value
        })
    }
    //submit Login handler to send a request to the node backend
    submitLogin = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            username : this.state.username,
            password : this.state.password
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/login',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    this.setState({
                        authFlag : true
                    });
                    this.setState({
                        loginStatus: response.data
                    });
                } else{
                    this.setState({
                        authFlag : false
                    })
                }
            });
    }
    render(){
        //redirect based on successful login
        // let redirectVar = null;
        // let invalidLoginMessage = "";
        // if (this.state.loginStatus === "Unsuccessful Login") {
        //     invalidLoginMessage = "Username and passwords dont match";
        // };
        // console.log(this.state.authFlag)
        // if(cookie.load('cookie')){
        //     redirectVar = <Redirect to= "/home"/>
        // } else {
        //     redirectVar = <Redirect to="/login"/>
        // }
        return(
            <>
            <Button variant="primary">Primary</Button>{' '}
            </>
        )
    }
}
//export Login Component
export default Login;