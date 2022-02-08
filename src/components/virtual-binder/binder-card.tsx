import * as React from 'react';
import { BoxCard } from '../../logic/model';

type Props = {
    card: BoxCard,
    style?: React.CSSProperties
}

const BinderCard = (props: Props) => {
    // TODO: Use card image
    // TODO: Display count
    return (
        <div
            style={{
                ...props.style,
                backgroundColor: 'green',
                overflow: 'clip'
            }}
        >
            {props.card.name} <br/>
            {props.card.setName} <br/>
            {props.card.versionLabel} <br/>
            {props.card.foil}
        </div>
    )
}
export default BinderCard;