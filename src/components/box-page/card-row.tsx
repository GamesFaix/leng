import { Checkbox, TableCell, TableRow } from '@mui/material';
import * as React from 'react';
import { icons } from '../../fontawesome';
import { BoxCard } from '../../logic/model';
import IconButton from '../common/icon-button';

type Props = {
    card: BoxCard
    onEditClicked: (card: BoxCard) => void,
    onDeleteClicked: (card: BoxCard) => void
}

const CardRow = (props: Props) => {
    return (<TableRow>
        <TableCell>
            {`${props.card.count}x`}
        </TableCell>
        <TableCell>
            {props.card.name}
        </TableCell>
        <TableCell>
            {props.card.setAbbrev.toUpperCase()}
        </TableCell>
        <TableCell>
            {props.card.version}
        </TableCell>
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
                icon={icons.edit}
                variant='outlined'
                color='secondary'
            />
            <IconButton
                title="Delete"
                onClick={() => props.onDeleteClicked(props.card)}
                icon={icons.delete}
                variant='outlined'
                color='secondary'
            />
        </TableCell>
    </TableRow>);
}
export default CardRow;