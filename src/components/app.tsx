import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { loadCards } from '../logic/bulk-data-controller';
import { EncyclopediaAction, EncyclopediaActionTypes, getEncyclopediaStatus } from '../store/encyclopedia';
import { RootState } from '../store';
import { AppSettings, AsyncRequestStatus } from '../logic/model';
import { Route, HashRouter, Routes } from 'react-router-dom';
import HomePage from './home-page/home-page';
import SettingsPage from './settings-page/settings-page';
import BoxPage from './box-page/box-page';
import { Typography } from '@mui/material';
import LoadingMessage from './loading-message';
import { settingsActions } from '../store/settings';

async function loadEncyclopedia(settings: AppSettings, dispatch: (action: EncyclopediaAction) => void) {
    dispatch({
        type: EncyclopediaActionTypes.LoadStart
    });

    const cards = await loadCards(settings);

    dispatch({
        type: EncyclopediaActionTypes.LoadSuccess,
        cards: cards
    });
}

const App = () => {
    const dispatch = useDispatch();
    const settings = useSelector((state: RootState) => state.settings.settings);
    const encyclopediaState = useSelector((state: RootState) => state.encyclopedia);
    const encyclopediaStatus = getEncyclopediaStatus(encyclopediaState);

    React.useEffect(() => {
        if (settings === null) {
            dispatch(settingsActions.loadStart());
        }
        else if (encyclopediaStatus === AsyncRequestStatus.NotStarted) {
            loadEncyclopedia(settings, dispatch);
        }
    });

    const isLoading = encyclopediaStatus === AsyncRequestStatus.NotStarted
        || encyclopediaStatus === AsyncRequestStatus.Started;

    return (
        <div>
            <Typography variant="h2">
                Leng
            </Typography>
            {isLoading
                ? <LoadingMessage message="Loading Scryfall card data..."/>
                : <HashRouter>
                    <Routes>
                        <Route path="/" element={<HomePage/>} />
                        <Route path="/boxes/:name" element={<BoxPage/>}/>
                        <Route path="/settings" element={<SettingsPage/>}/>
                    </Routes>
                </HashRouter>
            }
        </div>
    );
}

export default App;
