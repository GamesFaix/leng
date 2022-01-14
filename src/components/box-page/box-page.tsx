import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { icons } from '../../fontawesome';
import { loadBox } from '../../logic/inventoryController';
import { AsyncRequestStatus, BoxCard } from '../../logic/model';
import { RootState } from '../../store';
import { getEncyclopediaStatus } from '../../store/encyclopedia';
import { InventoryAction, InventoryActionTypes } from '../../store/inventory';
import CardsTable from './cards-table';

const BoxPage = () => {
    const { name } = useParams();
    const encyclopediaState = useSelector((state: RootState) => state.encyclopedia);
    const encyclopediaStatus = getEncyclopediaStatus(encyclopediaState);
    const boxState = useSelector((state: RootState) => state.inventory.boxes.find(b => b.name === name));
    const settings = useSelector((state: RootState) => state.settings.settings);
    const dispatch = useDispatch();

    React.useEffect(() => {
        if (settings !== null && boxState.cards === null){
            console.log('loading box');
            loadBox(settings, name, dispatch);
        }
    })

    function addCard(card: BoxCard) {
        const action : InventoryAction = {
            type: InventoryActionTypes.AddCard,
            card,
            boxInfo: {
                name: boxState.name,
                lastModified: boxState.lastModified
            }
        };
        dispatch(action);
    }

    const disabled = encyclopediaStatus !== AsyncRequestStatus.Success || !boxState.cards;

    return (
        <div>
            <h2>Box <span className="box-name">{name}</span></h2>
            {boxState.description
                ? <h3>{boxState.description}</h3>
                : ""
            }
            <br/>
            {disabled ? "" :
                <CardsTable
                    cards={boxState.cards}
                    showNewCardRow={true}
                    onAddCard={addCard}
                />
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