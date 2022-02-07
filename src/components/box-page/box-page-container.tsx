import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AsyncRequestStatus, Box, BoxCard, BoxCardModule } from '../../logic/model';
import { RootState } from '../../store';
import { getEncyclopediaStatus } from '../../store/encyclopedia';
import 'react-virtualized/styles.css';
import { useStore } from '../../hooks';
import { inventoryActions } from '../../store/inventory';
import BoxPage from './box-page';

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
    const encyclopediaState = useSelector((state: RootState) => state.encyclopedia);
    const encyclopediaStatus = getEncyclopediaStatus(encyclopediaState);

    const lastSavedBoxState = useStore.box(name ?? null);
    const [oldBox, setOldBox] = React.useState(lastSavedBoxState);
    const [newBox, setNewBox] = React.useState(lastSavedBoxState);
    const [anyUnsavedChanges, setAnyUnsavedChanges] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [cardToEdit, setCardToEdit] = React.useState<BoxCard | null>(null);
    const cardCount = (newBox?.cards ?? []).map(c => c.count).reduce((a, b) => a + b, 0);

    React.useLayoutEffect(() => {
        if (oldBox?.cards === null && name && !isLoading) {
            dispatch(inventoryActions.boxLoadStart(name));
            setIsLoading(true);
        }
        else if (oldBox?.cards === null
            && oldBox !== lastSavedBoxState) {
            setOldBox(lastSavedBoxState);
            setNewBox(lastSavedBoxState);
            setIsLoading(false);
        }
    });

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

    const disabled = !name
        || encyclopediaStatus !== AsyncRequestStatus.Success
        || oldBox === null
        || newBox === null;

    if (disabled) { return <div>Loading...</div>; }

    return (
        <BoxPage
            name={name}
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