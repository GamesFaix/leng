import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useParams } from 'react-router-dom';
import { icons } from '../../fontawesome';
import { loadBox } from '../../logic/inventoryController';
import { AsyncRequestStatus, BoxCard } from '../../logic/model';
import { RootState } from '../../store';
import { getEncyclopediaStatus } from '../../store/encyclopedia';
import CardsTable from './cards-table';

const BoxPage2 = () => {
    const { name } = useParams();

    const dispatch = useDispatch();
    const settings = useSelector((state: RootState) => state.settings.settings);
    const encyclopediaState = useSelector((state: RootState) => state.encyclopedia);
    const encyclopediaStatus = getEncyclopediaStatus(encyclopediaState);

    const lastSavedBoxState = useSelector((state: RootState) => state.inventory.boxes?.find(b => b.name === name)) ?? null;
    const [oldBox, setOldBox] = React.useState(lastSavedBoxState);
    const [newBox, setNewBox] = React.useState(oldBox);

    React.useLayoutEffect(() => {
        if (settings !== null && oldBox?.cards === null && name){
            console.log('loading box');
            loadBox(settings, name, dispatch)
                .then(box => {
                    setOldBox(box);
                    setNewBox(box);
                });
        }
    })

    function addCard(card: BoxCard) {
        if (!newBox?.cards) { return; }

        const match = newBox.cards.find(c => c.scryfallId === card.scryfallId && c.foil === card.foil);

        let cards = [];

        if (match) {
            const updatedCard = {
                ...match,
                count: match.count + card.count
            };
            cards = [ updatedCard ].concat(newBox.cards.filter(c => c !== match));
        }
        else {
            cards = [ card ].concat(newBox.cards);
        }

        setNewBox({...newBox, cards });
    }

    function updateCard(card: BoxCard) {
        if (!newBox?.cards) { return; }

        const match = newBox.cards.find(c => c.scryfallId === card.scryfallId && c.foil === card.foil);

        const cards = match
            ? [ card ].concat(newBox.cards.filter(c => c !== match))
            : [ card ].concat(newBox.cards);

        setNewBox({...newBox, cards });
    }

    const disabled = encyclopediaStatus !== AsyncRequestStatus.Success || oldBox === null || newBox === null;

    return (
        <div>
            <h2>Box <span className="box-name">{name}</span></h2>
            {newBox?.description
                ? <h3>{newBox.description}</h3>
                : ""
            }
            <br/>
            {disabled ? "" :
                <CardsTable
                    cards={newBox.cards ?? []}
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
export default BoxPage2;