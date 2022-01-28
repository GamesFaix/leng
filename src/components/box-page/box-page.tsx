import { Card } from '@mui/material';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { loadBox, updateBox } from '../../logic/inventoryController';
import { AsyncRequestStatus, Box, BoxCard, BoxCardModule } from '../../logic/model';
import { RootState } from '../../store';
import { getEncyclopediaStatus } from '../../store/encyclopedia';
import CardsTable from './cards-table';
import 'react-virtualized/styles.css';
import { AddCardForm, EditCardForm } from './card-form';
import { useStore } from '../../hooks';
import BoxHeaderCard from './box-header-card';

function addOrIncrememnt(cards: BoxCard[], card: BoxCard) : BoxCard[] {
    const match = cards.find(c => BoxCardModule.areSame(c, card));
    if (match) {
        const others = cards.filter(c => !BoxCardModule.areSame(c, card));
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

type Mode = 'add' | 'edit'

const BoxPage = () => {
    const { name } = useParams();

    const dispatch = useDispatch();
    const navigate = useNavigate();
    const settings = useStore.settings();
    const encyclopediaState = useSelector((state: RootState) => state.encyclopedia);
    const encyclopediaStatus = getEncyclopediaStatus(encyclopediaState);

    const lastSavedBoxState = useSelector((state: RootState) => state.inventory.boxes?.find(b => b.name === name)) ?? null;
    const [oldBox, setOldBox] = React.useState(lastSavedBoxState);
    const [newBox, setNewBox] = React.useState(oldBox);
    const [anyUnsavedChanges, setAnyUnsavedChanges] = React.useState(false);

    const cardCount = (newBox?.cards ?? []).map(c => c.count).reduce((a, b) => a + b, 0);

    React.useLayoutEffect(() => {
        if (settings !== null && oldBox?.cards === null && name){
            loadBox(settings, name, dispatch)
                .then(box => {
                    setOldBox(box);
                    setNewBox(box);
                });
        }
    });

    const [mode, setMode] = React.useState<Mode>('add');
    const [cardToEdit, setCardToEdit] = React.useState<BoxCard | null>(null);

    function cancel() {
        if (mode === 'add') {

        }
        else {
            if (cardToEdit) {
                addCard(cardToEdit);
                setCardToEdit(null);
            }
            setMode('add');
        }
    }

    function submit(card: BoxCard) {
        if (mode === 'add') {
            addCard(card);
        }
        else {
            addCard(card);
            setCardToEdit(null);
            setMode('add');
        }
    }

    function checkout(card: BoxCard) {
        if (cardToEdit) {
            addCard(cardToEdit);
        }
        setCardToEdit(card);
        deleteCard(card);
        setMode('edit');
    }

    function addCard(card: BoxCard) {
        if (!newBox?.cards) { return; }
        const cards = addOrIncrememnt(newBox.cards, card);
        setNewBox({...newBox, cards });
        setAnyUnsavedChanges(true);
        setCardToEdit(null);
    }

    function deleteCard(card: BoxCard) {
        if (!newBox?.cards) { return; }
        const cards = newBox.cards.filter(c => !BoxCardModule.areSame(c, card));
        setNewBox({...newBox, cards });
        setAnyUnsavedChanges(true);
    }

    function save() {
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
    }

    const disabled = encyclopediaStatus !== AsyncRequestStatus.Success || oldBox === null || newBox === null;

    if (!name) { return <div>Loading...</div>; }

    return (
        <div>
            <BoxHeaderCard
                name={name}
                cardCount={cardCount}
                unsavedChanges={anyUnsavedChanges}
                save={save}
            />
            <br/>
            <Card sx={{ width: 700, padding: 1 }}>
                {mode === 'add'
                    ? <AddCardForm
                        onSubmit={submit}
                        onCancel={cancel}
                    />
                    : <EditCardForm
                        card={cardToEdit}
                        onSubmit={submit}
                        onCancel={cancel}
                    />
                }
            </Card>
            <br/>
            <Card sx={{ width: 900, padding: 1 }}>
                {disabled ? "" :
                    <CardsTable
                        cards={newBox.cards ?? []}
                        onEditClicked={checkout}
                        onDeleteClicked={deleteCard}
                    />
                }
            </Card>
        </div>
    );
};
export default BoxPage;