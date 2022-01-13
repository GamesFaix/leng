import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadCards } from '../logic/bulk-data-controller';
import CardSearch from './box-page/active-card-row/card-search';
import { EncyclopediaAction, EncyclopediaActionTypes, EncyclopediaState } from '../store/encyclopedia';
import SetSearch from './box-page/active-card-row/set-search';
import { RootState } from '../store';
import { AsyncRequestStatus } from '../logic/model';
import VersionPicker from './box-page/active-card-row/version-picker';
import { Route, HashRouter, Routes } from 'react-router-dom';
import HomePage from './home-page/home-page';
import BoxPage from './box-page/box-page';
import SettingsPage from './settings-page/settings-page';

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

const App2 = () => {
    return (
        <HashRouter>
            <Routes>
                <Route path="/" element={<HomePage/>} />
                <Route path="/boxes/:id" element={<BoxPage/>}/>
                <Route path="/settings" element={<SettingsPage/>}/>
            </Routes>
        </HashRouter>
    )
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
                    <VersionPicker />
                </>
                : <div>Loading card data...</div>
            }
        </div>
    );
}

export default App2;