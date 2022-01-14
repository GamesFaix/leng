import * as React from 'react';
import { BoxCard } from '../../logic/model';
import ActiveCardRow from './active-card-row/active-card-row';
import CardRow from './card-row';

type Props = {
    showNewCardRow: boolean,
    cards: BoxCard[],
    onAddCard: (card: BoxCard) => void
}

const CardsTable = (props: Props) => {
    return (<table>
        <thead>
            <tr>
                <th>Qty.</th>
                <th>Name</th>
                <th>Set</th>
                <th>Version</th>
                <th>Foil</th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            {props.showNewCardRow
                ? <ActiveCardRow
                        card={null}
                        onSubmit={props.onAddCard}
                        onCancel={() => { return; /* maybe hide the row later */ }}
                    />
                : ""
            }
            {props.cards.map((c, i) =>
                <CardRow key={i.toString()} card={c}/>
            )}
        </tbody>
    </table>);
}
export default CardsTable;