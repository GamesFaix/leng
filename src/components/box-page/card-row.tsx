import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { icons } from '../../fontawesome';
import { BoxCard } from '../../logic/model';

type Props = {
    card: BoxCard
    onEditClicked: (card: BoxCard) => void,
    onDeleteClicked: (card: BoxCard) => void
}

const CardRow = (props: Props) => {
    return (<tr>
        <td>
            {`${props.card.count}x`}
        </td>
        <td>
            {props.card.name}
        </td>
        <td>
            {props.card.setAbbrev.toUpperCase()}
        </td>
        <td>
            {props.card.version}
        </td>
        <td>
            <input
                type="checkbox"
                checked={props.card.foil}
                disabled
            />
        </td>
        <td>
            <button
                title="Edit"
                type="button"
                onClick={() => props.onEditClicked(props.card)}
            >
                <FontAwesomeIcon icon={icons.edit}/>
            </button>
            <button
                title="Delete"
                type="button"
                onClick={() => props.onDeleteClicked(props.card)}
            >
                <FontAwesomeIcon icon={icons.delete}/>
            </button>
        </td>
    </tr>);
}
export default CardRow;