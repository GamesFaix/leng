import { ThemeProvider } from '@mui/material';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import App from './components/app';
import { store } from 'leng-core/src/store';
import "./styles.scss";
import { darkTheme } from 'leng-core/src/ui/theme';
import { runSagas } from 'leng-core/src/sagas';
import { cardDataProvider, imageDownloader, inventoryReadProvider, inventoryWriteProvider, settingsProvider, tappedOutCsvExportProvider } from './file-system';

runSagas({
    images: imageDownloader,
    settings: settingsProvider,
    cardData: cardDataProvider,
    inventoryRead: inventoryReadProvider,
    inventoryWrite: inventoryWriteProvider,
    tappedOut: tappedOutCsvExportProvider
});
  
ReactDOM.render(
    <Provider store={store}>
        <ThemeProvider theme={darkTheme}>
            <App />
        </ThemeProvider>
    </Provider>,
    document.getElementById('app')
);