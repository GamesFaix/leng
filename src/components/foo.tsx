import * as React from 'react';
import { Card } from '../model';
import CardResultList from './card-results-list';

type Props = {
}

const App = (props: Props) =>
{
    const cards: Card[] = [
        { Name: "Black Lotus" },
        { Name: "Lightning Bolt" }
    ];

    return (
        <div>
            <CardResultList Cards={cards}/>
        </div>
    );
}

export default App;