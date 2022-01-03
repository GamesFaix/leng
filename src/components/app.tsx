import * as React from 'react';
import { Card } from '../model';
import * as Scryfall from 'scryfall-api';
import { DebounceInput } from 'react-debounce-input';

async function queryCards(query: string) : Promise<Array<Card>> {
    // const pageLength = 175; // Cannot be changed
    const cards = await Scryfall.Cards.search(query).all();
    return cards.map(c => { return { Name: c.name }; });
}

const App = () =>
{
    let [cards, setCards] = React.useState([]);

    const onQueryChanged : (e: any) => Promise<void> = async e => {
        const query = e.target.value?.trim() || "";
        if (query !== "") {
            const cards = await queryCards(query);
            return setCards(cards);
        }
    }

    return (
        <div>
            <div>
                <span>Query: </span>
                <DebounceInput
                    onChange={onQueryChanged}
                    minLength={3}
                    debounceTimeout={300}
                />
            </div>
            <div>
                {cards.map((c, i) => { return (
                    <div key={i.toString()}>
                        {c.Name}
                    </div>
                );})}
            </div>
        </div>
    );
}

export default App;