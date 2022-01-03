import * as React from 'react';
import { Card } from '../model';
import CardResultList from './card-results-list';
import * as Scryfall from 'scryfall-api';
import * as Axios from 'axios';

type Props = {
}

const App = (props: Props) =>
{
    const defaultCards: Card[] = [
        { Name: "Black Lotus" },
        { Name: "Lightning Bolt" }
    ];

    let [cards, setCards] = React.useState(defaultCards);

    React.useEffect(() => {
        const pageLength = 175; // Cannot be changed

        const query = "type:Goblin";

        Scryfall.Cards.search(query).all()
            .then(cards => {
                const models : Card[] = cards.map(c => { return { Name: c.name }; });
                setCards(models);
            });
    });

    return (
        <div>
            <CardResultList Cards={cards}/>
        </div>
    );
}

export default App;