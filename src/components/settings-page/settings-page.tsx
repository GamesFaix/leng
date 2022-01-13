import * as React from 'react';
import { Link } from 'react-router-dom';

const SettingsPage = () => {
    return (
        <div>
            Settings page
            <br/>
            <Link to ="/">
                Go back to home
            </Link>
        </div>
    )
}
export default SettingsPage;