import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, HashRouter, Routes } from 'react-router-dom';
import BoxPageContainer from './box-page/box-page-container';
import { CollectionPage, ReportsPage, SettingsPage } from 'leng-core/src/components/pages';
import BoxesPageContainer from './boxes-page/boxes-page-container';
import SplashScreen from 'leng-core/src/components/splash-screen';
import { preloadActions } from 'leng-core/src/store/preload';
import { selectors } from 'leng-core/src/store';
import NavBar from 'leng-core/src/components/navbar';

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
                        <Route path="/settings" element={<SettingsPage/>}/>
                        <Route path="/collection" element={<CollectionPage/>}/>
                        <Route path="/reports" element={<ReportsPage/>}/>
                    </Routes>
                    : <SplashScreen message={message} />
                }
        </HashRouter>
    );
}

export default App;
