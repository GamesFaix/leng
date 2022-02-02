import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { CircularProgress, IconButton, TableCell, TableRow } from '@mui/material';
import moment = require('moment');
import * as React from 'react';
import { Link } from 'react-router-dom';
import { icons } from '../../fontawesome';
import { BoxState } from '../../store/inventory';

type Props = {
    box: BoxState,
    deleteBox: () => void
}

const BoxRow = (props: Props) => {
    const cardCount = props.box.cards?.map(c => c.count).reduce((a,b) => a+b, 0) ?? null;

    return (<TableRow>
        <TableCell>
            <Link to={`/boxes/${props.box.name}`}>
                <IconButton
                    title="Open box"
                    color='primary'
                >
                    <FontAwesomeIcon icon={icons.open}/>
                </IconButton>
            </Link>
        </TableCell>
        <TableCell>
            {props.box.name}
        </TableCell>
        <TableCell>
            {moment(props.box.lastModified).calendar()}
        </TableCell>
        <TableCell>
            {cardCount === null
                ? <CircularProgress/>
                : cardCount
            }
        </TableCell>
        <TableCell>
            <IconButton
                title="Delete box"
                onClick={() => {
                    if (confirm("Are you sure you want to exile this box?")) {
                        props.deleteBox();
                    }
                }}
                color='primary'
            >
                <FontAwesomeIcon icon={icons.delete}/>
            </IconButton>
        </TableCell>
    </TableRow>);
}
export default BoxRow;