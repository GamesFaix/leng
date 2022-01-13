import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadCards } from '../logic/bulk-data-controller';
import CardSearch from './card-search';
import { EncyclopediaAction, EncyclopediaActionTypes, EncyclopediaState } from '../store/encyclopedia';
import SetSearch from './set-search';
import { RootState } from '../store';
import { AsyncRequestStatus } from '../logic/model';

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

function getEncyclopediaStatus(state: EncyclopediaState) : AsyncRequestStatus {
    if (state.isLoading) {
        return AsyncRequestStatus.Started;
    }

    if (state.cards.length === 0) {
        return AsyncRequestStatus.NotStarted;
    }

    return AsyncRequestStatus.Success;
}

const App = () =>
{
    const dispatch = useDispatch();
    const encyclopediaState = useSelector((state: RootState) => state.encyclopedia);
    const encyclopediaStatus = getEncyclopediaStatus(encyclopediaState);
    console.log(encyclopediaState);

    React.useEffect(() => {
        if (encyclopediaStatus === AsyncRequestStatus.NotStarted)
        {
            loadEncyclopedia(dispatch);
        }
    });

    return (
        <div className='app'>
            {encyclopediaStatus === AsyncRequestStatus.Success
                ? <>
                    <CardSearch />
                    <SetSearch />
                </>
                : <div>Loading card data...</div>
            }
        </div>
    );
}

export default App;