import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { userLocation, currentTime } from './Home';

const List = () => {
  const [wineries, setWineries] = useState([]);
  const [error, setError] = useState(null);
  const [selectedWinery, setSelectedWinery] = useState(null);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [userReview, setUserReview] = useState('');
  const [receiveNotifications, setReceiveNotifications] = useState(false);
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    fetch('http://localhost:8080/api/wineries')
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched data: ', data);
        setWineries(data);
      })
      .catch((error) => {
        console.error('Fetch error:', error);
        setError(error);
      });
  }, []);

  const handleRatingClick = (winery) => {
    setSelectedWinery(winery);
    setModalIsOpen(true);
  };

  const handleReviewClick = (winery) => {
    setSelectedWinery(winery);
    setModalIsOpen(true);
  };

  const handleNotificationsClick = () => {
    setReceiveNotifications(true);
    setModalIsOpen(true);
  };

  const handleModalClose = () => {
    setModalIsOpen(false);
    setUserRating(0);
    setUserReview('');
    setReceiveNotifications(false);
    setUserEmail('');
  };

  const handleRatingSubmit = () => {
    console.log(`Rating submitted for ${selectedWinery.name}: ${userRating}`);
    handleModalClose();
  };

  const handleReviewSubmit = () => {
    console.log(`Review submitted for ${selectedWinery.name}: ${userReview}`);
    handleModalClose();
  };

  const handleEmailSubmit = () => {
    console.log(`Email submitted: ${userEmail}`);
    handleModalClose();
  };

  const containerStyle = {
    textAlign: 'center',
    padding: '20px',
  };

  const titleStyle = {
    color: 'darkred',
    fontFamily: 'Your Modern Font, sans-serif',
    fontSize: '24px',
    marginBottom: '20px',
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
    fontSize:'22px',
    border: '1px solid lightgray',
    margin: '10px 0',
    padding: '20px',
    backgroundColor: '#5e1228',
    color: 'white',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  const buttonContainerStyle = {
    display: 'flex',
    gap: '5px',
   
  };

  const buttonStyle = {
    backgroundColor: '#5e1228',
    color: 'white',
    border: 'none',
    cursor: 'pointer',
    padding: '10px 20px',
    borderRadius: '5px',
    fontSize: '16px',
  };

  return (
    <div style={containerStyle}>
      <h2 style={titleStyle}>List of Wineries</h2>

      {error ? (
        <p style={errorMessageStyle}>Error fetching wineries: {error.message}</p>
      ) : (
        <ul style={listStyle}>
          {wineries.map((winery) => (
            <li key={winery.id} style={listItemStyle}>
              {winery.name}
              <div style={buttonContainerStyle}>
                <button
                  style={buttonStyle}
                  onClick={() => handleRatingClick(winery)}
                >
                  Rate
                </button>
                <button
                  style={buttonStyle}
                  onClick={() => handleReviewClick(winery)}
                >
                  Review
                </button>
                <button
                  style={buttonStyle}
                  onClick={handleNotificationsClick}
                >
                  Receive Notifications
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <Modal isOpen={modalIsOpen} onRequestClose={handleModalClose} style={{
        content: {
        width: '50%',
        maxWidth: '500px', // Set a maximum width to ensure responsiveness
        margin: 'auto',
        backgroundColor: 'white',
        borderRadius: '10px',
        padding: '20px',
          },
        }}>
        {userRating > 0 && (
          <div>
            <h2>Rate {selectedWinery && selectedWinery.name}</h2>
            <select
              value={userRating}
              onChange={(e) => setUserRating(Number(e.target.value))}
              style={{ marginBottom: '20px' }}
            >
              <option value={0}>Select Rating</option>
              <option value={1}>1</option>
              <option value={2}>2</option>
              <option value={3}>3</option>
              <option value={4}>4</option>
              <option value={5}>5</option>
            </select>
            <button
              onClick={handleRatingSubmit}
              style={buttonStyle}
            >
              Submit Rating
            </button>
          </div>
        )}

        {userReview && (
          <div>
            <h2>Review {selectedWinery && selectedWinery.name}</h2>
            <p>{userReview}</p>
            <button
              onClick={handleReviewSubmit}
              style={buttonStyle}
            >
              Submit Review
            </button>
          </div>
        )}

        {receiveNotifications && (
          <div>
            <h2>Receive Notifications</h2>
            <p>
              By entering your email you agree to receive notifications for every upcoming event or promotions that we will have!
            </p>
            <input
              type="email"
              value={userEmail}
              onChange={(e) => setUserEmail(e.target.value)}
              placeholder="Enter your email"
              style={{ marginBottom: '20px', padding: '10px', width: '70%',borderRadius:'5px',marginRight:'2px' }}
            />
            <button
              onClick={handleEmailSubmit}
              style={buttonStyle}
            >
              Add Email
            </button>
          </div>
        )}

        <button
          onClick={handleModalClose}
          style={buttonStyle}
        >
          Cancel
        </button>
      </Modal>
    </div>
  );
};

export default List;
