import { Tab, Tabs } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { BoxCard } from '../../logic/model';
import selectors from '../../store/selectors';
import TabPanel from '../common/tab-panel';
import BinderBySetReport from './binder-by-set-report';
import MissingFromBinderReport from './missing-from-binders-report';
import { Set, SetType } from 'scryfall-api';

type SetTypeKey = keyof typeof SetType

const ReportsPage = () => {
    const [tabId, setTabId] = React.useState(0);
    const boxes = useSelector(selectors.boxes);
    const sets = useSelector(selectors.sets);

    function binderReport(filter ?: (c:BoxCard) => boolean) {
        return <BinderBySetReport boxes={boxes} filter={filter}/>;
    }

    function binderOfSetsReport(filter: (s:Set) => boolean) {
        const filteredSetAbbrevs = sets.filter(filter).map(s => s.code);
        const cardFilter = (c:BoxCard) => filteredSetAbbrevs.includes(c.setAbbrev);
        return binderReport(cardFilter);
    }

    function isMajorSet(s: Set) : boolean {
        return s.set_type === "core" || s.set_type === "expansion" || s.set_type === "masters";
    }

    function isOfTypes(s: Set, types: SetTypeKey[]) : boolean {
        return types.includes(s.set_type);
    }

    function isBetween(s:Set, start:string, end:string) : boolean {
        return s.released_at !== undefined
            && s.released_at >= start
            && s.released_at <= end;
    }

    function isOrHasParent(s:Set, parentAbbrev:string) {
        return s.code === parentAbbrev
            || s.parent_set_code === parentAbbrev;
    }

    function anyOf(s: Set, abbrevs:string[]) : boolean {
        return abbrevs.find(a => isOrHasParent(s, a)) !== undefined;
    }

    return (<div>
        <Tabs
            value={tabId}
            onChange={(e, tabId) => setTabId(tabId)}
        >
            <Tab label="All cards, by set"/>
            <Tab label="Alpha - 5ED"/>
            <Tab label="Weatherlight - Prophecy"/>
            <Tab label="Invasion - Scourge"/>
            <Tab label="8ED - New Phyrexia"/>
            <Tab label="M12 - Journey Into Nyx"/>
            <Tab label="Dominaria - ..."/>
            <Tab label="Misc"/>
            {/* <Tab label="Missing from Binders"/> */}
        </Tabs>
        <TabPanel hidden={tabId !== 0}>
            {binderReport()}
        </TabPanel>
        <TabPanel hidden={tabId !== 1}>
            {binderOfSetsReport(s =>
                isOfTypes(s, [ 'core', 'expansion', 'masters' ]) && // Masters for Chronicles
                isBetween(s, '1993-01-01', '1997-04-01'))}
        </TabPanel>
        <TabPanel hidden={tabId !== 2}>
            {binderOfSetsReport(s =>
                isOfTypes(s, [ 'core', 'expansion' ]) &&
                isBetween(s, '1997-04-01', '2000-07-01'))}
        </TabPanel>
        <TabPanel hidden={tabId !== 3}>
            {binderOfSetsReport(s =>
                isOfTypes(s, [ 'core', 'expansion' ]) &&
                isBetween(s, '2000-07-01', '2003-06-01'))}
        </TabPanel>
        <TabPanel hidden={tabId !== 4}>
            {binderOfSetsReport(s =>
                isOfTypes(s, [ 'core', 'expansion' ]) &&
                isBetween(s, '2003-06-01', '2011-06-01'))}
        </TabPanel>
        <TabPanel hidden={tabId !== 5}>
            {binderOfSetsReport(s =>
                isOfTypes(s, [ 'core', 'expansion' ]) &&
                isBetween(s, '2011-06-01', '2014-09-01'))}
        </TabPanel>
        <TabPanel hidden={tabId !== 6}>
            {binderOfSetsReport(s =>
                anyOf(s, ['dom', 'mh1', 'm19', 'm20', 'm21', 'tsr', 'cmr', 'eld', 'afr']))}
        </TabPanel>
        <TabPanel hidden={tabId !== 7}>
            {binderOfSetsReport(s =>
                (s.set_type === 'starter' && isBetween(s, '1993-01-01', '2001-01-01'))
                || (s.set_type === 'funny' && isBetween(s, '1993-01-01', '2005-01-01'))
                || (s.set_type === 'box' && isBetween(s, '1993-01-01', '2002-01-01'))
                || s.code === 'cst' /* coldsnap decks */
            )}
        </TabPanel>

        {/*
         <TabPanel hidden={tabId !== 1}>
             <MissingFromBinderReport />
         </TabPanel>
        */}
    </div>);
}
export default ReportsPage;