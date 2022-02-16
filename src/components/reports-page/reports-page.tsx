import { Tab, Tabs } from '@mui/material';
import * as React from 'react';
import TabPanel from '../common/tab-panel';

const ReportsPage = () => {
    const [tabId, setTabId] = React.useState(0);

    return (<div>
        <Tabs
            value={tabId}
            onChange={(e, tabId) => setTabId(tabId)}
        >
            <Tab label="Tab 1"/>
            <Tab label="Tab 2"/>
            <Tab label="Tab 3"/>
        </Tabs>
        <TabPanel hidden={tabId !== 0}>
            <span>Tab 1 contents</span>
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