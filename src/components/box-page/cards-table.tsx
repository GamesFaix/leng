import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from '@mui/material';
import * as React from 'react';
import { BoxCard } from '../../logic/model';
import ActiveCardRow from './active-card-row';
import CardRow from './card-row';

type Props = {
    cards: BoxCard[],
    onAddClicked: (card: BoxCard) => void,
    onSaveEditClicked: (card: BoxCard, index: number) => void,
    onDeleteClicked: (card: BoxCard) => void
}

function getKey (card: BoxCard) {
    return `${card.scryfallId}|${card.foil}|${card.lang}`;
}

const CardsTable = (props: Props) => {
    const [activeRowKey, setActiveRowKey] = React.useState<string | null>(null);

    function addCardRow() {
        return (<ActiveCardRow
            key="new-card"
            card={null}
            onSubmit={props.onAddClicked}
            onCancel={() => { return; }}
        />);
    }

    function editCardRow(card: BoxCard, index: number) {
        return (<ActiveCardRow
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
                        <TableCell>Language</TableCell>
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