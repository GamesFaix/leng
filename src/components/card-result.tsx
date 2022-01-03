import * as React from 'react';
import { Card } from '../model';

type Props = {
    Card: Card
}

const CardResult = (props: Props) =>
{
    return (
        <div>
            {props.Card.Name}
        </div>
    );
}

export default CardResult;