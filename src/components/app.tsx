import * as React from 'react';
import CardSearch from './card-search';

const App = () =>
{
    return (
        <div className='app'>
            <CardSearch
                onSelection={card => console.log(`selected ${card.name}`)}
            />
        </div>
    );
}

export default App;