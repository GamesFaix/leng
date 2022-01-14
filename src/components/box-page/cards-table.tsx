import * as React from 'react';
import { BoxCard } from '../../logic/inventoryController';

type Props = {
    cards: BoxCard[]
}

const CardsTable = (props: Props) => {
    return (<table>
        <thead>
            <th>Qty.</th>
            <th>Name</th>
            <th>Version</th>
            <th>Foil</th>
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
                        {c.version}
                    </td>
                    <td>
                        {c.foil}
                    </td>
                </tr>
            )}
        </tbody>
    </table>);
}
export default CardsTable;