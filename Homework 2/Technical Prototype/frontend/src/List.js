import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { userLocation, currentTime } from './Home';

const List = () => {
    const [wineries, setWineries] = useState([]);
    const [error, setError] = useState(null);
    const [selectedWinery, setSelectedWinery] = useState(null);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [userRating, setUserRating] = useState(0);

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

    const handleRatingClick = winery => {
        setSelectedWinery(winery);
        setModalIsOpen(true);
    };

    const handleModalClose = () => {
        setModalIsOpen(false);
        setUserRating(0);
    };

    const handleRatingSubmit = () => {
        console.log(`Rating submitted for ${selectedWinery.name}: ${userRating}`);
        handleModalClose();
    };

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
        display: 'flex',
        justifyContent: 'space-between',
    };

    const ratingButtonStyle = {
        backgroundColor: 'white',
        color: 'darkred',
        border: 'none',
        cursor: 'pointer',
    };

    return (
        <div style={containerStyle}>
            <h2 style={titleStyle}>List of Wineries</h2>

            {error ? (
                <p style={errorMessageStyle}>Error fetching wineries: {error.message}</p>
            ) : (
                <ul style={listStyle}>
                    {wineries.map(winery => (
                        <li key={winery.id} style={listItemStyle}>
                            {winery.name}
                            <button
                                style={ratingButtonStyle}
                                onClick={() => handleRatingClick(winery)}
                            >
                                Rate
                            </button>
                        </li>
                    ))}
                </ul>
            )}

            <Modal isOpen={modalIsOpen} onRequestClose={handleModalClose}>
                <h2>Rate {selectedWinery && selectedWinery.name}</h2>
                <select value={userRating} onChange={e => setUserRating(Number(e.target.value))}>
                    <option value={0}>Select Rating</option>
                    <option value={1}>1</option>
                    <option value={2}>2</option>
                    <option value={3}>3</option>
                    <option value={4}>4</option>
                    <option value={5}>5</option>
                </select>
                <button onClick={handleRatingSubmit}>Submit Rating</button>
                <button onClick={handleModalClose}>Cancel</button>
            </Modal>
        </div>
    );
};

export default List;