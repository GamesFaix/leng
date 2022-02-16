import { Tab, Tabs } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import selectors from '../../store/selectors';
import TabPanel from '../common/tab-panel';
import BinderBySetReport from './binder-by-set-report';

const ReportsPage = () => {
    const [tabId, setTabId] = React.useState(0);
    const boxes = useSelector(selectors.boxes);

    return (<div>
        <Tabs
            value={tabId}
            onChange={(e, tabId) => setTabId(tabId)}
        >
            <Tab label="Sets Binder"/>
            <Tab label="Tab 2"/>
            <Tab label="Tab 3"/>
        </Tabs>
        <TabPanel hidden={tabId !== 0}>
            <BinderBySetReport boxes={boxes} />
        </TabPanel>
        <TabPanel hidden={tabId !== 1}>
            <span>Tab 2 contents</span>
        </TabPanel>
        <TabPanel hidden={tabId !== 2}>
            <span>Tab 3 contents</span>
        </TabPanel>
    </div>);
}
export default ReportsPage;