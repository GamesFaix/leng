import * as React from 'react';
import { Card } from '../model';
import CardResultList from './card-results-list';
import * as Scryfall from 'scryfall-api';

async function queryCards(query: string) : Promise<Array<Card>> {
    const pageLength = 175; // Cannot be changed

    const cards = await Scryfall.Cards.search(query).all();

    return cards.map(c => { return { Name: c.name }; });
}

const App = () =>
{
    let [cards, setCards] = React.useState([]);

    const onQueryChanged : (e: React.FormEvent<HTMLInputElement>) => Promise<void> = e => {
        const query = e.currentTarget.value.trim();
        if (query) {
            return queryCards(query)
                .then(cards => setCards(cards))
        }
    }

    return (
        <div>
            <div>
                <span>Query: </span>
                <input type="text" onChange={onQueryChanged}/>
            </div>
            <CardResultList Cards={cards}/>
        </div>
    );
}

export default App;