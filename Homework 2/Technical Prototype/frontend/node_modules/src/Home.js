import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <div>
            <h2>Click to see wineries</h2>
            <Link to="/list">See List</Link>
        </div>
    );
}

export default Home;
