import * as React from 'react';
import { Card } from 'scryfall-api';
import { loadCards } from '../logic/bulk-data-controller';
import { CardName, toCardNames } from '../logic/model';
import CardSearch from './card-search';

const App = () =>
{
    const [cards, setCards] = React.useState<Card[]>([]);
    const [cardNames, setCardNames] = React.useState<CardName[]>([]);

    React.useEffect(() => {
        loadCards()
            .then(() => {
                console.log('setCards', cards);
                setCards(cards);
                const cardNames = toCardNames(cards);
                console.log('setCardNames', cardNames);
                setCardNames(cardNames);
            });
    });

    return (
        <div className='app'>
            <CardSearch
                cards={cardNames}
                onSelection={card => console.log(`selected ${card.name}`)}
            />
        </div>
    );
}

export default App;