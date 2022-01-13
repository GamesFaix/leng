import * as React from 'react';
import { Link, useParams } from 'react-router-dom';

const BoxPage = () => {
    const { id } = useParams()

    return (
        <div>
            Box page - {id}
            <br/>
            <Link to="/">
                Home
            </Link>
        </div>
    );
};
export default BoxPage;