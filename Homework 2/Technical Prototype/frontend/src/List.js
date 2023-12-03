import React, { useState, useEffect } from 'react';

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
                console.log("Fetched data: ", data); // Log the data
                setWineries(data);
            })
            .catch(error => {
                console.error('Fetch error:', error);
                setError(error);
            });
    }, []);

    return (
        <div>
            <h2>List of Wineries</h2>
            {error && <p>Error fetching data: {error.message}</p>}
            {Array.isArray(wineries) ? (
                wineries.map(winery => (
                    <div key={winery.id}>
                        {winery.name}
                    </div>
                ))
            ) : (
                <p>No wineries found or data is not in the correct format.</p>
            )}
        </div>
    );
}

export default List;
