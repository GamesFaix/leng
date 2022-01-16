import * as React from 'react';
import { icons } from '../../fontawesome';
import { BoxCard } from '../../logic/model';
import IconButton from '../common/icon-button';

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
            <IconButton
                title="Edit"
                onClick={() => props.onEditClicked(props.card)}
                icon={icons.edit}
            />
            <IconButton
                title="Delete"
                onClick={() => props.onDeleteClicked(props.card)}
                icon={icons.delete}
            />
        </td>
    </tr>);
}
export default CardRow;