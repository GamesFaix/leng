import * as React from 'react';
import { BoxCard } from '../../logic/model';
import ActiveCardRow from './active-card-row/active-card-row';
import CardRow from './card-row';

type Props = {
    cards: BoxCard[],
    onAddClicked: (card: BoxCard) => void,
    onSaveEditClicked: (card: BoxCard) => void,
    onDeleteClicked: (card: BoxCard) => void
}

function getKey (card: BoxCard) {
    return `${card.scryfallId}|${card.foil}`;
}

const CardsTable = (props: Props) => {
    const [activeRowKey, setActiveRowKey] = React.useState<string | null>(null);

    function addCardRow() {
        return (<ActiveCardRow
            key="new-card"
            card={null}
            onSubmit={props.onAddClicked}
            onCancel={() => { return; }}
        />);
    }

    function editCardRow(card: BoxCard) {
        return (<ActiveCardRow
            key={getKey(card)}
            card={card}
            onSubmit={card => {
                props.onSaveEditClicked(card);
                setActiveRowKey(null);
            }}
            onCancel={() => setActiveRowKey(null)}
        />);
    }

    function viewCardRow(card: BoxCard) {
        const key = getKey(card);
        return (<CardRow
            key={key}
            card={card}
            onEditClicked={_ => setActiveRowKey(key)}
            onDeleteClicked={props.onDeleteClicked}
        />);
    }

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
            {activeRowKey === null
                ? addCardRow()
                : <></>
            }
            {props.cards.map(c =>
                activeRowKey === getKey(c)
                    ? editCardRow(c)
                    : viewCardRow(c)
            )}
        </tbody>
    </table>);
}
export default CardsTable;