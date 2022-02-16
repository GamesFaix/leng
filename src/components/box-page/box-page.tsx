import { Card } from '@mui/material';
import * as React from 'react';
import { BoxCard } from '../../logic/model';
import CardsTable from './cards-table';
import 'react-virtualized/styles.css';
import { AddCardForm, EditCardForm } from './card-form';
import BoxHeaderCard from './box-header-card';
import CardSelectionActionsForm from './card-selection-actions-form';

type Props = {
    name: string,
    cards: BoxCard[],
    selectedKeys: string[],
    cardCount: number,
    cardToEdit: BoxCard | null,
    add: (card: BoxCard) => void,
    cancelAdd: () => void,
    startEdit: (card: BoxCard) => void,
    finishEdit: (card: BoxCard) => void,
    cancelEdit: () => void,
    delete: (card: BoxCard) => void,
    save: () => void
    bulkTransfer: (name: string) => void
    singleTransfer: (count: number, name: string) => void
    select: (keys: string[]) => void
}

const BoxPage = (props: Props) => {
    return (
        <div>
            <BoxHeaderCard
                name={props.name}
                cardCount={props.cardCount}
                save={props.save}
            />
            <br/>
            <CardSelectionActionsForm
                cards={props.cards}
                selectedKeys={props.selectedKeys}
                startEdit={props.startEdit}
                delete={props.delete}
                bulkTransferTo={props.bulkTransfer}
                singleTransferTo={props.singleTransfer}
            />
            <br/>
            <Card sx={{ width: 800, padding: 1 }}>
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
                selectedKeys={props.selectedKeys}
                onSelectionChanged={props.select}
            />
        </div>
    );
};
export default BoxPage;