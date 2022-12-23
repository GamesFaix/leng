import { Card } from '@mui/material';
import * as React from 'react';
import { BoxCard, CardFilter } from '../../logic/model';
import CardsTable from './cards-table';
import 'react-virtualized/styles.css';
import { AddCardForm, EditCardForm } from './card-form';
import BoxHeaderCard from './box-header-card';
import CardSelectionActionsForm from './card-selection-actions-form';
import CardFilterForm from '../collection-page/card-filter-form';

type Props = {
    name: string,
    cards: BoxCard[],
    selectedKeys: string[],
    cardCount: number,
    cardToEdit: BoxCard | null,
    filter: CardFilter,
    setFilter: (filter: CardFilter) => void,
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
            <CardFilterForm
                filter={props.filter}
                onChange={props.setFilter}
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