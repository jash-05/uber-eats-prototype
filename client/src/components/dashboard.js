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

// Define a Login Component
class Dashboard extends Component{
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
        let restaurantData = [
            {
                'restaurant_name': 'Five Guys',
                'restaurant_address': '1085 E Brokaw Road, San Jose, CA 95131',
                'restaurant_image': 'https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly9kdXl0NGg5bmZuajUwLmNsb3VkZnJvbnQubmV0L3Jlc2l6ZWQvYnVsa19hY3Rpb25zX2ltYWdlXzBkMGUwYTE1LTljZTctNGI4Ny1hYmQyLWMyZDA0NTNlYzRiYS13NTUwLTk0LmpwZw=='
            },
            {
                'restaurant_name': 'Five Guys',
                'restaurant_address': '1085 E Brokaw Road, San Jose, CA 95131',
                'restaurant_image': 'https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly9kdXl0NGg5bmZuajUwLmNsb3VkZnJvbnQubmV0L3Jlc2l6ZWQvYnVsa19hY3Rpb25zX2ltYWdlXzBkMGUwYTE1LTljZTctNGI4Ny1hYmQyLWMyZDA0NTNlYzRiYS13NTUwLTk0LmpwZw=='
            },
            {
                'restaurant_name': 'Five Guys',
                'restaurant_address': '1085 E Brokaw Road, San Jose, CA 95131',
                'restaurant_image': 'https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly9kdXl0NGg5bmZuajUwLmNsb3VkZnJvbnQubmV0L3Jlc2l6ZWQvYnVsa19hY3Rpb25zX2ltYWdlXzBkMGUwYTE1LTljZTctNGI4Ny1hYmQyLWMyZDA0NTNlYzRiYS13NTUwLTk0LmpwZw=='
            },
            {
                'restaurant_name': 'Five Guys',
                'restaurant_address': '1085 E Brokaw Road, San Jose, CA 95131',
                'restaurant_image': 'https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly9kdXl0NGg5bmZuajUwLmNsb3VkZnJvbnQubmV0L3Jlc2l6ZWQvYnVsa19hY3Rpb25zX2ltYWdlXzBkMGUwYTE1LTljZTctNGI4Ny1hYmQyLWMyZDA0NTNlYzRiYS13NTUwLTk0LmpwZw=='
            },
            {
                'restaurant_name': 'Five Guys',
                'restaurant_address': '1085 E Brokaw Road, San Jose, CA 95131',
                'restaurant_image': 'https://cn-geo1.uber.com/image-proc/resize/eats/format=webp/width=550/height=440/quality=70/srcb64=aHR0cHM6Ly9kdXl0NGg5bmZuajUwLmNsb3VkZnJvbnQubmV0L3Jlc2l6ZWQvYnVsa19hY3Rpb25zX2ltYWdlXzBkMGUwYTE1LTljZTctNGI4Ny1hYmQyLWMyZDA0NTNlYzRiYS13NTUwLTk0LmpwZw=='
            }
        ]

        const createCard = card => {
            return (
                <Col sm={3} className="ml-3 mt-3"  style={{ width: '15rem' }}>
                <Card>
                    <Card.Img variant="top" src={card.restaurant_image} />
                    <Card.Body>
                        <Card.Title>{card.restaurant_name}</Card.Title>
                        <Card.Text>
                              {card.restaurant_address}
                        </Card.Text>
                    </Card.Body>
                    </Card>
                  </Col>
            )
        }
        
        return(
            <Container>
                <Row>
                    <Col xs={3}>1 of 2</Col>
                    <Col xs={9}>
                      <Container>
                          <Row>
                          {restaurantData.map(createCard)}
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