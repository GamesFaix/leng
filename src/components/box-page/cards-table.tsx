import * as React from 'react';
import { BoxCard } from '../../logic/model';
import CardRow from './card-row';

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
                <CardRow key={i.toString()} card={c}/>
            )}
        </tbody>
    </table>);
}
export default CardsTable;