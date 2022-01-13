import * as React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div>
            <h2>Home</h2>
            <br/>
            <Link to="/boxes/1">
                Box 1
            </Link>
            <br/>
            <Link to="/settings">
                Settings
            </Link>
        </div>
    );
};
export default HomePage;