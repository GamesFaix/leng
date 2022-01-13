import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { icons } from '../../fontawesome';
import { AsyncRequestStatus } from '../../logic/model';
import { RootState } from '../../store';
import { getEncyclopediaStatus } from '../../store/encyclopedia';
import CardSearch from './active-card-row/card-search';
import SetSearch from './active-card-row/set-search';
import VersionPicker from './active-card-row/version-picker';

const BoxPage = () => {
    const { id } = useParams()
    const encyclopediaState = useSelector((state: RootState) => state.encyclopedia);
    const encyclopediaStatus = getEncyclopediaStatus(encyclopediaState);

    return (
        <div>
            <h2>Box {id}</h2>
            <br/>
            <div className='app'>
                {encyclopediaStatus === AsyncRequestStatus.Success
                    ? <>
                        <CardSearch />
                        <SetSearch />
                        <VersionPicker />
                    </>
                    : <div>Loading card data...</div>
                }
            </div>
            <br/>
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