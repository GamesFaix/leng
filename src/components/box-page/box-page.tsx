import { Card } from '@mui/material';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import { AsyncRequestStatus, Box, BoxCard, BoxCardModule } from '../../logic/model';
import { RootState } from '../../store';
import { getEncyclopediaStatus } from '../../store/encyclopedia';
import CardsTable from './cards-table';
import 'react-virtualized/styles.css';
import { AddCardForm, EditCardForm } from './card-form';
import { useStore } from '../../hooks';
import BoxHeaderCard from './box-header-card';
import LoadingMessage from '../loading-message';
import { inventoryActions } from '../../store/inventory';
import TransferForm from './transfer-form';

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
    const encyclopediaState = useSelector((state: RootState) => state.encyclopedia);
    const encyclopediaStatus = getEncyclopediaStatus(encyclopediaState);

    const lastSavedBoxState = useStore.box(name ?? null);
    const [oldBox, setOldBox] = React.useState(lastSavedBoxState);
    const [newBox, setNewBox] = React.useState(lastSavedBoxState);
    const [anyUnsavedChanges, setAnyUnsavedChanges] = React.useState(false);
    const [isLoading, setIsLoading] = React.useState(false);
    const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);

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
        const key = BoxCardModule.getKey(card);
        if (selectedKeys.includes(key)){
            setSelectedKeys(selectedKeys.filter(k => k !== key));
        }
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

    function transferTo(boxName: string) {
        // dispatch transfer action
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
            {isLoading ? <LoadingMessage message="Loading box details..."/> : <>
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
                {selectedKeys.length > 0 
                    ?<>
                        <br/>
                        <TransferForm
                            transferTo={transferTo}
                        />
                    </>
                    :<></>
                }
                <br/>
                {disabled ? "" :
                    <CardsTable
                        cards={newBox.cards ?? []}
                        onEditClicked={checkout}
                        onDeleteClicked={deleteCard}
                        selectedKeys={selectedKeys}
                        onSelectionChanged={setSelectedKeys}
                    />
                }
            </>}
        </div>
    );
};
export default BoxPage;