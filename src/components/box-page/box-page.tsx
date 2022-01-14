import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { icons } from '../../fontawesome';
import { loadBox } from '../../logic/inventoryController';
import { AsyncRequestStatus } from '../../logic/model';
import { RootState } from '../../store';
import { getEncyclopediaStatus } from '../../store/encyclopedia';
import CardSearch from './active-card-row/card-search';
import SetSearch from './active-card-row/set-search';
import VersionPicker from './active-card-row/version-picker';
import CardsTable from './cards-table';

const BoxPage = () => {
    const { name } = useParams();
    const encyclopediaState = useSelector((state: RootState) => state.encyclopedia);
    const encyclopediaStatus = getEncyclopediaStatus(encyclopediaState);
    const boxState = useSelector((state: RootState) => state.inventory.boxes.find(b => b.name === name));
    const settings = useSelector((state: RootState) => state.settings.settings);

    React.useEffect(() => {
        if (settings !== null && boxState.cards === null){
            loadBox(settings, name);
        }
    })

    return (
        <div>
            <h2>Box <span className="box-name">{name}</span></h2>
            {boxState.description
                ? <h3>{boxState.description}</h3>
                : ""
            }
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
            {boxState.cards !== null
                ? <CardsTable cards={boxState.cards}/>
                : ""
            }
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