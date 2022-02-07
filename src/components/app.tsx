import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { encyclopediaActions, getEncyclopediaStatus } from '../store/encyclopedia';
import { RootState } from '../store';
import { AsyncRequestStatus } from '../logic/model';
import { Route, HashRouter, Routes } from 'react-router-dom';
import BoxesPage from './boxes-page/boxes-page';
import { Typography } from '@mui/material';
import LoadingMessage from './common/loading-message';
import { settingsActions } from '../store/settings';
import BoxPageContainer from './box-page/box-page-container';
import CollectionPageContainer from './collection-page/collection-page-container';
import SettingsPageContainer from './settings-page/settings-page-container';

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
            dispatch(encyclopediaActions.loadStart());
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
                        <Route path="/" element={<BoxesPage/>} />
                        <Route path="/boxes/:name" element={<BoxPageContainer/>}/>
                        <Route path="/settings" element={<SettingsPageContainer/>}/>
                        <Route path="/collection" element={<CollectionPageContainer/>}/>
                    </Routes>
                </HashRouter>
            }
        </div>
    );
}

export default App;
