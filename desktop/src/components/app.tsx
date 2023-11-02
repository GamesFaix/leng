import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, HashRouter, Routes } from 'react-router-dom';
import BoxPageContainer from './box-page/box-page-container';
import CollectionPageContainer from './collection-page/collection-page-container';
import SettingsPageContainer from './settings-page/settings-page-container';
import BoxesPageContainer from './boxes-page/boxes-page-container';
import SplashScreen from './splash-screen';
import { preloadActions } from '../store/preload';
import selectors from '../store/selectors';
import ReportsPage from './reports-page/reports-page';
import NavBar from './navbar';

const App = () => {
    const dispatch = useDispatch();
    const { ready, message } = useSelector(selectors.preload);

    React.useLayoutEffect(() => {
        if (!ready && message === '') {
            dispatch(preloadActions.start());
        }
    });

    return (
        <HashRouter>
            <NavBar/>
                {ready
                    ? <Routes>
                        <Route path="/" element={<BoxesPageContainer/>} />
                        <Route path="/boxes/:name" element={<BoxPageContainer/>}/>
                        <Route path="/settings" element={<SettingsPageContainer/>}/>
                        <Route path="/collection" element={<CollectionPageContainer/>}/>
                        <Route path="/reports" element={<ReportsPage/>}/>
                    </Routes>
                    : <SplashScreen message={message} />
                }
        </HashRouter>
    );
}

export default App;
