import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { Box, BoxCard, BoxCardModule } from '../../logic/model';
import 'react-virtualized/styles.css';
import { inventoryActions } from '../../store/inventory';
import BoxPage from './box-page';
import selectors from '../../store/selectors';

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

const BoxPageContainer = () => {
    const { name } = useParams();

    const dispatch = useDispatch();

    const lastSavedBoxState = useSelector(selectors.box(name!));
    const [newBox, setNewBox] = React.useState(lastSavedBoxState);
    const [anyUnsavedChanges, setAnyUnsavedChanges] = React.useState(false);
    const [cardToEdit, setCardToEdit] = React.useState<BoxCard | null>(null);
    const cardCount = (newBox?.cards ?? []).map(c => c.count).reduce((a, b) => a + b, 0);

    function cancel() {
        if (cardToEdit) {
            addCard(cardToEdit);
            setCardToEdit(null);
        }
    }

    function submit(card: BoxCard) {
        addCard(card);
        if (cardToEdit) {
            setCardToEdit(null);
        }
    }

    function checkout(card: BoxCard) {
        if (cardToEdit) {
            addCard(cardToEdit);
        }
        setCardToEdit(card);
        deleteCard(card);
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
        if (newBox) {
            const box : Box = {
                name: newBox.name,
                description: newBox.description ?? '',
                cards: newBox.cards ?? [],
                lastModified: newBox.lastModified
            };
            dispatch(inventoryActions.boxSaveStart(box));
            setAnyUnsavedChanges(false);
        }
    }

    return (
        <BoxPage
            name={name!}
            anyUnsavedChanges={anyUnsavedChanges}
            cards={newBox?.cards ?? []}
            cardCount={cardCount}
            cardToEdit={cardToEdit}
            add={submit}
            cancelAdd={cancel}
            startEdit={checkout}
            finishEdit={submit}
            cancelEdit={cancel}
            delete={deleteCard}
            save={save}
        />
    );
};
export default BoxPageContainer;