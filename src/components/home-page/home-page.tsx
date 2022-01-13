import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { icons } from '../../fontawesome';

const HomePage = () => {
    return (
        <div>
            <h2>Home</h2>
            <br/>
            <Link to="/boxes/1">
                <button title="Box 1">
                    Box 1
                </button>
            </Link>
            <br/>
            <Link to="/settings">
                <button title="Settings">
                    <FontAwesomeIcon icon={icons.settings} />
                </button>
            </Link>
        </div>
    );
};
export default HomePage;