import * as React from 'react';
import { Link, useParams } from 'react-router-dom';

const BoxPage = () => {
    const { id } = useParams()

    return (
        <div>
            <h2>Box {id}</h2>
            <br/>
            <Link to="/">
                Home
            </Link>
        </div>
    );
};
export default BoxPage;