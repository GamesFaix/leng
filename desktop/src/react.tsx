import { ThemeProvider } from '@mui/material';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/app';
import { store } from 'leng-core/src/store';
import "./styles.scss";
import { darkTheme } from 'leng-core/src/ui/theme';
import { runSagas } from './sagas';

runSagas();
  
ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={darkTheme}>
            <App />
        </ThemeProvider>
    </Provider>,
    document.getElementById('app')
);