import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { GoogleMap, DirectionsRenderer, DirectionsService, LoadScript } from '@react-google-maps/api';
import { userLocation, currentTime } from './Home';
import { useTranslation } from 'react-i18next';

const List = () => {
  const { t } = useTranslation();
  const [distances, setDistances] = useState({});
  const [wineries, setWineries] = useState([]);
  const [selectedWineryDetails, setSelectedWineryDetails] = useState(null);
  const [directionsResponse, setDirectionsResponse] = useState(null);
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
        // Create an array of promises for fetching distances
        const distancePromises = data.map(winery => fetchDistance(winery.id));
        // Use Promise.all to wait for all distance fetches to complete
        return Promise.all(distancePromises);
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
    setSelectedWineryDetails(null); // Reset winery details when closing modal
    setDirectionsResponse(null); // Reset directions when closing modal
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

  const handleWineryClick = async (winery) => {
    setSelectedWinery(winery);
    try {
      const details = await fetchWineryDetails(winery.id);
      setSelectedWineryDetails(details);
      fetchDirections(winery.location); // Assuming winery has a location property
      setModalIsOpen(true);
    } catch (error) {
      console.error('Error fetching winery details:', error);
    }
  };

  const fetchWineryDetails = async (wineryId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/wineries/${wineryId}/details`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const details = await response.json();
      setSelectedWineryDetails(details);
    } catch (error) {
      console.error('Error fetching winery details:', error);
    }
  };


  const fetchDirections = (wineryLocation) => {
    if (userLocation && wineryLocation) {
      const origin = { lat: userLocation.latitude, lng: userLocation.longitude };
      const destination = { lat: wineryLocation.latitude, lng: wineryLocation.longitude };
      setDirectionsResponse(null); // Reset previous directions
    }
  };

  const fetchDistance = async (wineryId) => {
    try {
      const response = await fetch(`http://localhost:8080/api/wineries/${wineryId}/distance?userLat=${userLocation.latitude}&userLon=${userLocation.longitude}`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const distance = await response.json();
      setDistances(prevDistances => ({ ...prevDistances, [wineryId]: distance }));
    } catch (error) {
      console.error('Error fetching distance for winery:', error);
    }
  };


  const containerStyle = {
    textAlign: 'center',
    padding: '20px',
  };

  const titleStyle = {
    color: 'darkred',
    fontFamily:"Noto Sans, sans-serif",
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
        <h2 style={titleStyle}>{t('list.title')}</h2>
        {error ? (
            <p style={errorMessageStyle}>{t('list.error', { error: error.message })}</p>
        ) : (
            <ul style={listStyle}>
              {wineries.map((winery) => (
                  <li key={winery.id} style={listItemStyle}>
                    {winery.name}
                    <div>
                      {t('list.distance', { distance: distances[winery.id]?.toFixed(2) })}
                    </div>
                    <div style={buttonContainerStyle}>
                      <button
                          style={buttonStyle}
                          onClick={() => handleRatingClick(winery)}
                      >
                        {t('list.rate')}
                      </button>
                      <button
                          style={buttonStyle}
                          onClick={() => handleReviewClick(winery)}
                      >
                        {t('list.review')}
                      </button>
                      <button
                          style={buttonStyle}
                          onClick={handleNotificationsClick}
                      >
                        {t('list.receiveNotifications')}
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
          {selectedWineryDetails && (
              <div>
                <h3>{selectedWineryDetails.name}</h3>
                <p>{t('list.address', { street: selectedWineryDetails.street, city: selectedWineryDetails.city })}</p>
                <p>{t('list.craft', { craft: selectedWineryDetails.craft })}</p>
                <p>{t('list.openingHours', { openingHours: selectedWineryDetails.openingHours })}</p>
                <p>{t('list.phone', { phone: selectedWineryDetails.phone })}</p>
                <p>{t('list.website', { website: selectedWineryDetails.website })}</p>
                <p>{t('list.email', { email: selectedWineryDetails.email })}</p>
                <p>{t('list.currentlyOpen', { currentlyOpen: selectedWineryDetails.currentlyOpen ? 'Yes' : 'No' })}</p>
              </div>
          )}
          {userRating > 0 && (
              <div>
                <h2>{t('list.rateWinery', { name: selectedWinery && selectedWinery.name })}</h2>
                <select
                    value={userRating}
                    onChange={(e) => setUserRating(Number(e.target.value))}
                    style={{ marginBottom: '20px' }}
                >
                  <option value={0}>{t('list.selectRating')}</option>
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
                  {t('list.submitRating')}
                </button>
              </div>
          )}

          {userReview && (
              <div>
                <h2>{t('list.reviewWinery', { name: selectedWinery && selectedWinery.name })}</h2>
                <p>{userReview}</p>
                <button
                    onClick={handleReviewSubmit}
                    style={buttonStyle}
                >
                  {t('list.submitReview')}
                </button>
              </div>
          )}

          {receiveNotifications && (
              <div>
                <h2>{t('list.receiveNotifications')}</h2>
                <p>
                  {t('list.receiveNotificationsDescription')}
                </p>
                <input
                    type="email"
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    placeholder={t('list.enterEmail')}
                    style={{ marginBottom: '20px', padding: '10px', width: '70%', borderRadius: '5px', marginRight: '2px' }}
                />
                <button
                    onClick={handleEmailSubmit}
                    style={buttonStyle}
                >
                  {t('list.addEmail')}
                </button>
              </div>
          )}

          <button
              onClick={handleModalClose}
              style={buttonStyle}
          >
            {t('list.cancel')}
          </button>

          {/* Google Maps Integration */}
          <LoadScript googleMapsApiKey="YOUR_GOOGLE_MAPS_API_KEY">
            <GoogleMap
                center={userLocation}
                zoom={15}
            >
              {directionsResponse && (
                  <DirectionsRenderer
                      directions={directionsResponse}
                  />
              )}
              <DirectionsService
                  options={{
                    destination: selectedWinery.location,
                    origin: userLocation,
                    travelMode: "DRIVING"
                  }}
                  callback={res => {
                    if (res.status === 'OK') {
                      setDirectionsResponse(res);
                    } // Handle other statuses if needed
                  }}
              />
            </GoogleMap>
          </LoadScript>
        </Modal>
      </div>
  );
};

export default List;
