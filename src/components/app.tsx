import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, HashRouter, Routes } from 'react-router-dom';
import { Typography } from '@mui/material';
import BoxPageContainer from './box-page/box-page-container';
import CollectionPageContainer from './collection-page/collection-page-container';
import SettingsPageContainer from './settings-page/settings-page-container';
import BoxesPageContainer from './boxes-page/boxes-page-container';
import SplashScreen from './splash-screen';
import { preloadActions } from '../store/preload';
import selectors from '../store/selectors';

const App = () => {
    const dispatch = useDispatch();
    const { ready, message } = useSelector(selectors.preload);

    React.useLayoutEffect(() => {
        if (!ready && message === '') {
            dispatch(preloadActions.start());
        }
    });

    return (
        <div>
            <Typography variant="h2">
                Leng
            </Typography>
            {ready
                ? <HashRouter>
                    <Routes>
                        <Route path="/" element={<BoxesPageContainer/>} />
                        <Route path="/boxes/:name" element={<BoxPageContainer/>}/>
                        <Route path="/settings" element={<SettingsPageContainer/>}/>
                        <Route path="/collection" element={<CollectionPageContainer/>}/>
                    </Routes>
                </HashRouter>
                : <SplashScreen message={message} />
            }
        </div>
    );
}

export default App;
