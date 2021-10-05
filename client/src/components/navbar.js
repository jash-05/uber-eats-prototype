import React, {Component} from 'react';
import './../App.css';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav'
import FormControl from 'react-bootstrap/FormControl'
import NavDropdown from 'react-bootstrap/NavDropdown'
import Image from 'react-bootstrap/Image';
import Container from 'react-bootstrap/Container';

// Define a Login Component
class DashboardNavbar extends Component{
    //call the constructor method
    constructor(props){
        //Call the constructor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            authFlag : false,
        }
        //Bind the handlers to this class
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
    render(){
        return(
            <>
                <Navbar expand="xxl">
                    <Container fluid className="px-5 py-3">
                    <Navbar.Brand href="/dashboard">
                        <Image 
                            src="https://uber-eats-prototype.s3.us-west-1.amazonaws.com/logo.svg"
                            style={{height: "2rem"}}
                        ></Image>
                    </Navbar.Brand>
                    <Nav>
                        <Form className="d-flex mx-5">
                            <FormControl
                                type="search"
                                size="md"
                                placeholder="What are you craving?"
                                className="mx-2 px-4 py-1 border-0 border-bottom"
                                style = {{width: "30rem", backgroundColor: "#f6f6f6"}}
                            />
                            {/* <Button variant="outline-success">Search</Button> */}
                        </Form>
                        <Button variant="dark" size="md">Cart • 2</Button>
                    </Nav>
                    </Container>
                </Navbar>
            </>
        )
    }
}
//export Login Component
export default DashboardNavbar;