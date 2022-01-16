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
    return (<tr>
        <td>
            <Link to={`/boxes/${props.box.name}`}>
                <IconButton
                    title="Open box"
                    icon={icons.open}
                />
            </Link>
        </td>
        <td>
            {props.box.name}
        </td>
        <td>
            {moment(props.box.lastModified).calendar()}
        </td>
        <td>
            <IconButton
                title="Delete box"
                onClick={() => {
                    if (confirm("Are you sure you want to exile this box?")) {
                        props.deleteBox();
                    }
                }}
                icon={icons.delete}
            />
        </td>
    </tr>);
}
export default BoxRow;