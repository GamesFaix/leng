import * as React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
    return (
        <div>
            Home page
            <br/>
            <Link to="/boxes/1">
                Click here for box 1
            </Link>
            <Link to="/settings">
                Click here for settings
            </Link>
        </div>
    );
};
export default HomePage;