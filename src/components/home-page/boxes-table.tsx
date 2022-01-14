import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment = require('moment');
import * as React from 'react';
import { Link } from 'react-router-dom';
import { icons } from '../../fontawesome';
import { BoxState } from '../../store/inventory';

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
                        <button
                            title="Delete box"
                            onClick={() => props.deleteBox(b.name)}
                        >
                            <FontAwesomeIcon icon={icons.delete}/>
                        </button>
                    </td>
                </tr>
            )}
        </tbody>
    </table>)
}
export default BoxesTable;