import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { Link, useParams } from 'react-router-dom';
import { icons } from '../../fontawesome';

const BoxPage = () => {
    const { id } = useParams()

    return (
        <div>
            <h2>Box {id}</h2>
            <br/>
            <Link to="/">
                <button title="Home">
                    <FontAwesomeIcon icon={icons.home} />
                </button>
            </Link>
        </div>
    );
};
export default BoxPage;