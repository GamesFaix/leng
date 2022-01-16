import * as React from 'react';
import { BoxState } from '../../store/inventory';
import BoxRow from './box-row';

type Props = {
    boxes: BoxState[],
    deleteBox: (name:string) => void
}

const BoxesTable = (props: Props) => {
    return (<table>
        <thead>
            <tr>
                <th></th>
                <th>Name</th>
                <th>Last modified</th>
                <th></th>
            </tr>
        </thead>
        <tbody>
            {props.boxes.map(b =>
                <BoxRow
                    key={b.name}
                    box={b}
                    deleteBox={() => props.deleteBox(b.name)}
                />
            )}
        </tbody>
    </table>)
}
export default BoxesTable;