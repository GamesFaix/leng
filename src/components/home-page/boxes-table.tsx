import moment = require('moment');
import * as React from 'react';
import { Link } from 'react-router-dom';
import { icons } from '../../fontawesome';
import { BoxState } from '../../store/inventory';
import IconButton from '../common/icon-button';

type Props = {
    boxes: BoxState[],
    deleteBox: (name:string) => void
}

const BoxesTable = (props: Props) => {
    return (<table>
        <tbody>
            {props.boxes.map(b =>
                <tr key={b.name}>
                    <td>
                        <Link to={`/boxes/${b.name}`}>
                            <button>
                                {b.name}
                            </button>
                        </Link>
                    </td>
                    <td>
                        {moment(b.lastModified).calendar()}
                    </td>
                    <td>
                        <IconButton
                            title="Delete box"
                            onClick={() => {
                                if (confirm("Are you sure you want to exile this box?")) {
                                    props.deleteBox(b.name);
                                }
                            }}
                            icon={icons.delete}
                        />
                    </td>
                </tr>
            )}
        </tbody>
    </table>)
}
export default BoxesTable;