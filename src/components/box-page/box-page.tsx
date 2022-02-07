import { Card } from '@mui/material';
import * as React from 'react';
import { BoxCard } from '../../logic/model';
import CardsTable from './cards-table';
import 'react-virtualized/styles.css';
import { AddCardForm, EditCardForm } from './card-form';
import BoxHeaderCard from './box-header-card';

type Props = {
    name: string,
    anyUnsavedChanges: boolean,
    cards: BoxCard[],
    cardCount: number,
    cardToEdit: BoxCard | null,
    add: (card: BoxCard) => void,
    cancelAdd: () => void,
    startEdit: (card: BoxCard) => void,
    finishEdit: (card: BoxCard) => void,
    cancelEdit: () => void,
    delete: (card: BoxCard) => void,
    save: () => void
}

const BoxPage = (props: Props) => {
    return (
        <div>
            <BoxHeaderCard
                name={props.name}
                cardCount={props.cardCount}
                unsavedChanges={props.anyUnsavedChanges}
                save={props.save}
            />
            <br/>
            <Card sx={{ width: 700, padding: 1 }}>
                {props.cardToEdit === null
                    ? <AddCardForm
                        onSubmit={props.add}
                        onCancel={props.cancelAdd}
                    />
                    : <EditCardForm
                        card={props.cardToEdit}
                        onSubmit={props.finishEdit}
                        onCancel={props.cancelEdit}
                    />
                }
            </Card>
            <br/>
            <CardsTable
                cards={props.cards}
                onEditClicked={props.startEdit}
                onDeleteClicked={props.delete}
            />
        </div>
    );
};
export default BoxPage;