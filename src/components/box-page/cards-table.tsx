import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { icons } from '../../fontawesome';
import { BoxCard } from '../../logic/inventoryController';

type Props = {
    cards: BoxCard[]
}

const CardsTable = (props: Props) => {
    return (<table>
        <thead>
            <th>Qty.</th>
            <th>Name</th>
            <th>Set</th>
            <th>Version</th>
            <th>Foil</th>
            <th>Actions</th>
        </thead>
        <tbody>
            {props.cards.map((c, i) =>
                <tr key={i.toString()}>
                    <td>
                        {`${c.count}x`}
                    </td>
                    <td>
                        {c.name}
                    </td>
                    <td>
                        (set)
                    </td>
                    <td>
                        {c.version}
                    </td>
                    <td>
                        {c.foil}
                    </td>
                    <td>
                        <button
                            type="button"
                            onClick={() => {
                                //edit this row
                            }}
                        >
                            <FontAwesomeIcon icon={icons.edit}/>
                        </button>
                    </td>
                </tr>
            )}
        </tbody>
    </table>);
}
export default CardsTable;