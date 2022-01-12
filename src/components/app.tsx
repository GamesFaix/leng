import * as React from 'react';
import { useDispatch } from 'react-redux';
import { loadCards } from '../logic/bulk-data-controller';
import CardSearch from './card-search';
import { EncyclopediaAction, EncyclopediaActionTypes } from '../store/encyclopedia';

async function loadEncyclopedia(dispatch: (action: EncyclopediaAction) => void) {
    dispatch({
        type: EncyclopediaActionTypes.LoadStart
    });

    const cards = await loadCards();

    dispatch({
        type: EncyclopediaActionTypes.LoadSuccess,
        cards: cards
    });
}


const App = () =>
{
    const dispatch = useDispatch();

    React.useEffect(() => {
        loadEncyclopedia(dispatch);
    });

    return (
        <div className='app'>
            <CardSearch />
        </div>
    );
}

export default App;