import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { icons } from '../../fontawesome';
import { loadBox, updateBox } from '../../logic/inventoryController';
import { AsyncRequestStatus, Box, BoxCard } from '../../logic/model';
import { RootState } from '../../store';
import { getEncyclopediaStatus } from '../../store/encyclopedia';
import CardsTable from './cards-table';

const BoxPage = () => {
    const { name } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();
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
    const anyChanges = true;
    const saveDisabled = false; // TODO: Only enable if any changes pending

    return (
        <div>
            <h2>Box <span className="box-name">{name}</span></h2>
            {newBox?.description
                ? <h3>{newBox.description}</h3>
                : ""
            }
            <br/>
            <div>
                <button
                    title="Home"
                    onClick={() => {
                        if (anyChanges && !confirm("There are unsaved changes. Are you sure you want to go back?")) {
                            return;
                        }
                        navigate('/', { replace: true });
                    }}
                >
                    <FontAwesomeIcon icon={icons.home} />
                </button>
                <button
                    title="Save"
                    onClick={() => {
                        if (settings && newBox) {
                            const box : Box = {
                                name: newBox.name,
                                description: newBox.description ?? '',
                                cards: newBox.cards ?? [],
                                lastModified: newBox.lastModified
                            };

                            updateBox(settings, box, dispatch);
                        }
                    }}
                    disabled={saveDisabled}
                >
                    <FontAwesomeIcon icon={icons.save} />
                </button>
            </div>
            <br/>
            {disabled ? "" :
                <CardsTable
                    cards={newBox.cards ?? []}
                    showNewCardRow={true}
                    onAddCard={addCard}
                />
            }
        </div>
    );
};
export default BoxPage;