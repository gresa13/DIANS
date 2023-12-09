
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
        backgroundColor: '#f0f0f0',
    };

    const buttonStyle = {
        backgroundColor: '#8b0000',
        color: '#ffffff',
        padding: '10px 20px',
        borderRadius: '5px',
        textDecoration: 'none',
        fontSize: '16px',
        cursor: 'pointer', // Add a pointer cursor to indicate it's clickable
    };

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
            <h2>Click to see wineries</h2>
            <Link to="/list" style={buttonStyle} onClick={handleSeeListClick}>
                See List
            </Link>
        </div>
    );
};

export { userLocation, currentTime };

export default Home;