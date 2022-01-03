import * as React from 'react';
import { Card } from '../model';
import CardResult from './card-result';

type Props = {
    Cards: Card[]
}

const CardResultList = (props: Props) =>
{
    return (
        <div>
            <h2>Results: </h2>
            {props.Cards.map((c, i) => <CardResult Card={c} key={i.toString()} />)}
        </div>
    );
}

export default CardResultList;