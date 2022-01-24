import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, Typography } from '@mui/material';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { icons } from '../../fontawesome';
import { loadBox, updateBox } from '../../logic/inventoryController';
import { AsyncRequestStatus, Box, BoxCard } from '../../logic/model';
import { RootState } from '../../store';
import { getEncyclopediaStatus } from '../../store/encyclopedia';
import CardsTable from './cards-table';

function addOrIncrememnt(cards: BoxCard[], card: BoxCard) : BoxCard[] {
    const match = cards.find(c => c.name === card.name && c.foil === card.foil);
    if (match) {
        const others = cards.filter(c => c.name !== card.name || c.foil !== card.foil);
        const updated = {
            ...match,
            count: match.count + card.count
        };
        return [updated].concat(others);
    }
    else {
        return [card].concat(cards);
    }
}

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
    const [anyUnsavedChanges, setAnyUnsavedChanges] = React.useState(false);

    React.useLayoutEffect(() => {
        if (settings !== null && oldBox?.cards === null && name){
            loadBox(settings, name, dispatch)
                .then(box => {
                    setOldBox(box);
                    setNewBox(box);
                });
        }
    })

    function addCard(card: BoxCard) {
        if (!newBox?.cards) { return; }
        const cards = addOrIncrememnt(newBox.cards, card);
        setNewBox({...newBox, cards });
        setAnyUnsavedChanges(true);
    }

    function deleteCard(card: BoxCard) {
        if (!newBox?.cards) { return; }
        const cards = newBox.cards.filter(c => c.scryfallId !== card.scryfallId || c.foil !== card.foil);
        setNewBox({...newBox, cards });
        setAnyUnsavedChanges(true);
    }

    function saveCardEdit(card: BoxCard, index: number) {
        if (!newBox?.cards) { return; }
        let cards = [];
        for (let i=0; i<newBox.cards.length; i++) {
            if (i !== index) {
                cards.push(newBox.cards[i]);
            }
        }
        cards = addOrIncrememnt(cards, card);
        setNewBox({...newBox, cards });
        setAnyUnsavedChanges(true);
    }

    const disabled = encyclopediaStatus !== AsyncRequestStatus.Success || oldBox === null || newBox === null;

    return (
        <div>
            <Typography variant="h3">
                Box <span className="box-name">{name}</span>
            </Typography>
            {newBox?.description
                ? <h3>{newBox.description}</h3>
                : <></>
            }
            <br/>
            <div>
                <IconButton
                    title="Home"
                    onClick={() => {
                        if (anyUnsavedChanges && !confirm("There are unsaved changes. Are you sure you want to go back?")) {
                            return;
                        }
                        navigate('/', { replace: true });
                    }}
                    color='primary'
                >
                    <FontAwesomeIcon icon={icons.home}/>
                </IconButton>
                <IconButton
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
                            setAnyUnsavedChanges(false);
                        }
                    }}
                    disabled={!anyUnsavedChanges}
                    color='primary'
                >
                    <FontAwesomeIcon icon={icons.save}/>
                </IconButton>
            </div>
            <br/>
            <div className="cards-area">
                {disabled ? "" :
                    <CardsTable
                        cards={newBox.cards ?? []}
                        onAddClicked={addCard}
                        onSaveEditClicked={saveCardEdit}
                        onDeleteClicked={deleteCard}
                    />
                }
            </div>
        </div>
    );
};
export default BoxPage;