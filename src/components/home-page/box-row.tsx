import { TableCell, TableRow } from '@mui/material';
import moment = require('moment');
import * as React from 'react';
import { Link } from 'react-router-dom';
import { icons } from '../../fontawesome';
import { BoxState } from '../../store/inventory';
import IconButton from '../common/icon-button';

type Props = {
    box: BoxState,
    deleteBox: () => void
}

const BoxRow = (props: Props) => {
    return (<TableRow>
        <TableCell>
            <Link to={`/boxes/${props.box.name}`}>
                <IconButton
                    title="Open box"
                    icon={icons.open}
                    variant='outlined'
                    color='secondary'
                />
            </Link>
        </TableCell>
        <TableCell>
            {props.box.name}
        </TableCell>
        <TableCell>
            {moment(props.box.lastModified).calendar()}
        </TableCell>
        <TableCell>
            <IconButton
                title="Delete box"
                onClick={() => {
                    if (confirm("Are you sure you want to exile this box?")) {
                        props.deleteBox();
                    }
                }}
                icon={icons.delete}
                variant='outlined'
                color='secondary'
            />
        </TableCell>
    </TableRow>);
}
export default BoxRow;