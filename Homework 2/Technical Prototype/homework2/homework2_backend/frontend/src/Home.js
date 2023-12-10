import React from 'react';
import { Link } from 'react-router-dom';


let userLocation;
let currentTime;
const Home = () => {
    
    const containerStyle = {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        backgroundColor: '#5e1228',
    };

    const buttonStyle = {
        backgroundColor: '#e5d9dd',
        color: '#5e1228',
        padding: '10px 30px',
        marginTop:'-30px',
        borderRadius: '5px',
        textDecoration: 'none',
        fontSize: '18px',
        cursor: 'pointer', // Add a pointer cursor to indicate it's clickable
    };
    const pstyle={
        color: "#cccccc",
        fontSize:'13px',
    }
    const clickstyle={
        color:"white",
        fontFamily:"Noto Sans, sans-serif",
        fontWeight:"100",
        fontSize:"20px",
    }

    const handleSeeListClick = () => {
        // Get geolocation
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLocation = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude,
                    };

                    console.log('User Location:', userLocation);

                    // Get current time
                    const currentTime = new Date();
                    console.log('Current Time:', currentTime);
                    
                    
                },
                (error) => {
                    console.error('Error getting location:', error);
                }
            );
        } else {
            console.error('Geolocation is not supported by this browser.');
        }
    };

    return (
        <div style={containerStyle}>
           <img src="/WineSpots.png" alt="logo"  width={'450px'}></img>
            
            <Link to="/list" style={buttonStyle} onClick={handleSeeListClick}>
                See List
            </Link>
            <br></br>
        <p style={pstyle}>By clicking this button you are allowing app to access your location and current time.</p>
            

        </div>
    );
};

export { userLocation, currentTime };

export default Home;