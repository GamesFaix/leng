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
            {props.Cards.map(c => <CardResult Card={c}/>)}
        </div>
    );
}

export default CardResultList;