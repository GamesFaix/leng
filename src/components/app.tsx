import * as React from 'react';
import { Card } from 'scryfall-api';
import { CardName, toCardNames } from '../logic/model';
import BulkDataFetcher from './bulk-data-fetcher';
import CardSearch from './card-search';

const App = () =>
{
    const [cards, setCards] = React.useState<Card[]>([]);
    const [cardNames, setCardNames] = React.useState<CardName[]>([]);

    return (
        <div className='app'>
            <BulkDataFetcher
                cards={cards}
                onLoad={cards => {
                    console.log('setCards', cards);
                    setCards(cards);
                    const cardNames = toCardNames(cards);
                    console.log('setCardNames', cardNames);
                    setCardNames(cardNames);
                }}
            />
            <CardSearch
                cards={cardNames}
                onSelection={card => console.log(`selected ${card.name}`)}
            />
        </div>
    );
}

export default App;