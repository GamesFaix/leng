import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import * as React from 'react';
import { BoxCard } from '../../logic/model';
import AddCardRow from './active-card-row/add-card-row2';
import EditCardRow from './active-card-row/edit-card-row';
import CardRow from './card-row';

type Props = {
    cards: BoxCard[],
    onAddClicked: (card: BoxCard) => void,
    onSaveEditClicked: (card: BoxCard, index: number) => void,
    onDeleteClicked: (card: BoxCard) => void
}

function getKey (card: BoxCard) {
    return `${card.scryfallId}|${card.foil}`;
}

const CardsTable = (props: Props) => {
    const [activeRowKey, setActiveRowKey] = React.useState<string | null>(null);

    function addCardRow() {
        return (<AddCardRow
            key="new-card"
            onSubmit={props.onAddClicked}
            onCancel={() => { return; }}
        />);
    }

    function editCardRow(card: BoxCard, index: number) {
        return (<EditCardRow
            key={getKey(card)}
            card={card}
            onSubmit={card => {
                props.onSaveEditClicked(card, index);
                setActiveRowKey(null);
            }}
            onCancel={() => {
                setActiveRowKey(null);
            }}
        />);
    }

    function viewCardRow(card: BoxCard) {
        const key = getKey(card);
        return (<CardRow
            key={key}
            card={card}
            onEditClicked={card => {
                setActiveRowKey(key);
            }}
            onDeleteClicked={props.onDeleteClicked}
        />);
    }

    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell>Qty.</TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Set</TableCell>
                        <TableCell>Version</TableCell>
                        <TableCell>Foil</TableCell>
                        <TableCell>Actions</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {activeRowKey === null
                        ? addCardRow()
                        : <></>
                    }
                    {props.cards.map((c, i) =>
                        activeRowKey === getKey(c)
                            ? editCardRow(c, i)
                            : viewCardRow(c)
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export default CardsTable;