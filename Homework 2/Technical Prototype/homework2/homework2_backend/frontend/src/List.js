import React, { useState, useEffect } from 'react';
import { userLocation, currentTime } from './Home';

const List = () => {
    const [wineries, setWineries] = useState([]);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetch('http://localhost:8080/api/wineries')
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log("Fetched data: ", data);
                setWineries(data);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                setError(error);
            });
    }, []);

    const containerStyle = {
        textAlign: 'center',
    };

    const titleStyle = {
        color: 'darkred',
        fontFamily: 'Your Modern Font, sans-serif',
    };

    const errorMessageStyle = {
        color: 'red',
    };

    const listStyle = {
        listStyle: 'none',
        padding: 0,
    };

    const listItemStyle = {
        fontFamily: 'Your Modern Font, sans-serif',
        border: '1px solid lightgray',
        margin: '5px',
        padding: '10px',
        backgroundColor: 'darkred',
        color: 'white',
    };

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>List of Wineries</h2>

            {error ? (
                <p style={errorMessageStyle}>Error fetching wineries: {error.message}</p>
            ) : (
                <ul style={listStyle}>
                    {wineries.map(winery => (
                        <li key={winery.id} style={listItemStyle}>{winery.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default List;