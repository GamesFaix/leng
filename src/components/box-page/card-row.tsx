import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { icons } from '../../fontawesome';
import { BoxCard } from '../../logic/model';

type Props = {
    card: BoxCard
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
                type="button"
                onClick={() => {
                    //edit this row
                }}
            >
                <FontAwesomeIcon icon={icons.edit}/>
            </button>
        </td>
    </tr>);
}
export default CardRow;