import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Route, HashRouter, Routes, Link } from 'react-router-dom';
import { AppBar, Container, IconButton } from '@mui/material';
import BoxPageContainer from './box-page/box-page-container';
import CollectionPageContainer from './collection-page/collection-page-container';
import SettingsPageContainer from './settings-page/settings-page-container';
import BoxesPageContainer from './boxes-page/boxes-page-container';
import SplashScreen from './splash-screen';
import { preloadActions } from '../store/preload';
import selectors from '../store/selectors';
import ReportsPage from './reports-page/reports-page';
import { Box } from '@mui/system';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../fontawesome';

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
            <AppBar position='static'>
                <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                    <Link to="/collection">
                        <IconButton
                            title="Collection"
                            color='primary'
                        >
                            <FontAwesomeIcon icon={icons.collection}/>
                        </IconButton>
                    </Link>
                    <Link to="/">
                        <IconButton
                            title="Boxes"
                            color='primary'
                        >
                            <FontAwesomeIcon icon={icons.box}/>
                        </IconButton>
                    </Link>
                    <Link to="/reports">
                        <IconButton
                            title="Reports"
                            color='primary'
                        >
                            <FontAwesomeIcon icon={icons.report}/>
                        </IconButton>
                    </Link>
                    <Link to="/settings">
                        <IconButton
                            title="Settings"
                            color='primary'
                        >
                            <FontAwesomeIcon icon={icons.settings}/>
                        </IconButton>
                    </Link>
                </Box>
            </AppBar>
            <Container style={{ paddingTop: '12px' }}>
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
            </Container>
        </HashRouter>
    );
}

export default App;
