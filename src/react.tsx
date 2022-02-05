import { ThemeProvider } from '@mui/material';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/app';
import { store } from './store';
import "./styles.scss";
import { darkTheme } from './theme';

ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={darkTheme}>
            <App />
        </ThemeProvider>
    </Provider>,
    document.getElementById('app')
);