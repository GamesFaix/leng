import * as React from 'react';
import BulkDataFetcher from './bulk-data-fetcher';
import CardSearch from './card-search';

const App = () =>
{
    return (
        <div className='app'>
            <BulkDataFetcher/>
            <CardSearch
                onSelection={card => console.log(`selected ${card.name}`)}
            />
        </div>
    );
}

export default App;