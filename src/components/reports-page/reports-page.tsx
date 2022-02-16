import { Tab, Tabs } from '@mui/material';
import * as React from 'react';
import TabPanel from '../common/tab-panel';
import BinderBySetReport from './binder-by-set-report';

const ReportsPage = () => {
    const [tabId, setTabId] = React.useState(0);

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
            <BinderBySetReport/>
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