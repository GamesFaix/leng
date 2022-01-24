import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Checkbox, IconButton, TableCell, TableRow } from '@mui/material';
import * as React from 'react';
import { icons } from '../../fontawesome';
import { useStore } from '../../hooks';
import { BoxCard } from '../../logic/model';

type Props = {
    card: BoxCard
    onEditClicked: (card: BoxCard) => void,
    onDeleteClicked: (card: BoxCard) => void
}

const CardRow = (props: Props) => {
    const sets = useStore.sets();
    const setName = sets.find(s => s.abbrev === props.card.setAbbrev)?.name ?? '';

    return (<TableRow>
        <TableCell>{`${props.card.count}x`}</TableCell>
        <TableCell>{props.card.name}</TableCell>
        <TableCell>{setName}</TableCell>
        <TableCell>{props.card.version}</TableCell>
        <TableCell>
            <Checkbox
                checked={props.card.foil}
                disabled
            />
        </TableCell>
        <TableCell>
            <IconButton
                title="Edit"
                onClick={() => props.onEditClicked(props.card)}
                color='primary'
            >
                <FontAwesomeIcon icon={icons.edit}/>
            </IconButton>
            <IconButton
                title="Delete"
                onClick={() => props.onDeleteClicked(props.card)}
                color='primary'
            >
                <FontAwesomeIcon icon={icons.delete}/>
            </IconButton>
        </TableCell>
    </TableRow>);
}
export default CardRow;