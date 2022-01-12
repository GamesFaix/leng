import * as React from 'react';
import BulkDataFetcher from './bulk-data-fetcher';
import CardSearch from './card-search';

const App = () =>
{
    const [cards, setCards] = React.useState([]);

    return (
        <div className='app'>
            <BulkDataFetcher
                cards={cards}
                onLoad={cards => {
                    console.log('setCards', cards);
                    setCards(cards)
                }}
            />
            <CardSearch
                cards={cards}
                onSelection={card => console.log(`selected ${card.name}`)}
            />
        </div>
    );
}

export default App;