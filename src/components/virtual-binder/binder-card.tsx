import * as React from 'react';
import { BoxCard } from '../../logic/model';

type Props = {
    card: BoxCard
}

const BinderCard = (props: Props) => {
    // TODO: Use card image
    // TODO: Display count
    return (
        <div>
            {props.card.name} | {props.card.setName} | {props.card.collectorsNumber} | {props.card.foil}
        </div>
    )
}
export default BinderCard;