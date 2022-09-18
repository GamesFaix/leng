import { Divider, MenuItem, Select } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { BoxCard } from '../../logic/model';
import selectors from '../../store/selectors';
import BinderBySetReport from './binder-by-set-report';
import { Set } from 'scryfall-api';
import SetCompletionReport from './set-completion-report';

type Report = {
    name: string,
    render: () => JSX.Element
};

const ReportsPage = () => {
    const boxes = useSelector(selectors.boxes);
    const sets = useSelector(selectors.sets);
    const [selectedReport, setSelectedReport] = React.useState("2");

    function binderReport(cardFilter ?: (c:BoxCard) => boolean, sortSets ?: (a:Set,b:Set) => number) {
        return <BinderBySetReport boxes={boxes} cardFilter={cardFilter} sortSets={sortSets}/>;
    }

    function binderOfSetsReport(setFilter: (s:Set) => boolean, sortSets ?: (a:Set,b:Set) => number) {
        const filteredSetAbbrevs = sets.filter(setFilter).map(s => s.code);
        const cardFilter = (c:BoxCard) => filteredSetAbbrevs.includes(c.setAbbrev);
        return binderReport(cardFilter, sortSets);
    }

    function isOrHasParent(s:Set, parentAbbrev:string) {
        return s.code === parentAbbrev
            || s.parent_set_code === parentAbbrev;
    }

    function customOrder(abbrevs: string[]) : (a:Set,b:Set) => number {
        return (a,b) => {
            const aValue = abbrevs.indexOf(a.code);
            const bValue = abbrevs.indexOf(b.code);
            if (aValue < bValue) return -1;
            if (aValue > bValue) return 1;
            return 0;
        };
    }

    function setsInOrderReport(abbrevs: string[]) {
        return binderOfSetsReport(set => abbrevs.includes(set.code), customOrder(abbrevs));
    }

    const reports : Report[] = [
        {
            name: 'All cards, by set',
            render: () => binderReport() },
        {
            name: 'Core 1 (Alpha - 10th Edition)',
            render: () => setsInOrderReport([
                'lea', 'leb', '2ed', '3ed', '4ed', 'chr',
                '5ed', '6ed', '7ed', '8ed', '9ed', '10e',
            ]) },
        {
            name: 'Core 2 (Magic 2010 - Core 2021)',
            render: () => setsInOrderReport([
                'm10', 'm11', 'm12', 'm13', 'm14', 'm15',
                'ori', 'm19', 'm20', 'm21'
            ]) },
        {
            name: 'Classical 1 (Pre-Block - Tempest Block)',
            render: () => setsInOrderReport([
                'arn', 'atq', 'leg', 'drk', 'fem', // pre-block
                'ice', 'hml', 'all', 'csp', 'cst', // ice age block
                'mir', 'vis', 'wth', // mirage block
                'tmp', 'sth', 'exo', // tempest block
            ]) },
        {
            name: 'Classical 2 (Urza Block - Odyssey)',
            render: () => setsInOrderReport([
                'usg', 'ulg', 'uds', // urza block
                'mmq', 'nem', 'pcy', // masques block
                'inv', 'pls', 'apc', // invasion block
                'ody',
            ]) },
        {
            name: 'Modern 1 (Torment - Alara Block)',
            render: () => setsInOrderReport([
                'tor', 'jud', // odyssey block
                'ons', 'lgn', 'scg', // onslaught block
                'mrd', 'dst', '5dn', // mirrodin block
                'bhk', 'bok', 'sok', // kamigawa block
                'rav', 'gpt', 'dis', // ravnica block
                'tsp', 'plc', 'fut', 'tsr', // time spiral block
                'lrw', 'mor', 'shm', 'eve', // lorwyn/shadowmoor
                'ala', 'con', 'arb', // alara block
            ]) },
        {
            name: 'Modern 2 (Zendikar Block - Theros Block)',
            render: () => setsInOrderReport([
                'zen', 'wwk', 'roe', // zendikar block
                'som', 'mbs', 'nph', // scars of mirrodin block
                'isd', 'dka', 'avr', // innistrad block
                'rtr', 'gtc', 'dgm', // return to ravnica block
                'ths', 'bng', 'jou', // theros block
            ]) },
        {
            name: 'Pioneer 1 (Tarkir Block - Ixalan Block)',
            render: () => setsInOrderReport([
                'ktk', 'frf', 'dtk', // tarkir block
                'bfz', 'ogw', // battle for zenikar block
                'soi', 'emn', // shadows over innistrad block
                'kld', 'aer', // kaladesh block
                'akh', 'hou', // amonkhet block
                'xln', 'rix', // ixalan block
            ]) },
        {
            name: 'Pioneer 2 (Dominaria - Crimson Vow)',
            render: () => setsInOrderReport([
                'dom', 'grn', 'rna', 'war', // war of the spark
                'eld', 'thb', 'iko', 'znr', // 2020
                'kld', 'stx', 'afr', 'mid', 'vow', // 2021
            ]) },
        {
            name: 'Pioneer 3 (Neon Dynasty - ?)',
            render: () => setsInOrderReport([
                'neo', 'snc', 'dmu', 'bro' // 2022
            ]) },
        {
            name: 'Casual (Silver, Commander, etc.)',
            render: () => setsInOrderReport([
                'ugl', 'unh', 'ust',
                'bbd', 'mh1', 'mh2', 'cmr', 'clb'
            ]) },
        {
            name: 'Starter',
            render: () => setsInOrderReport([
                'por', 'p02', 'ptk', 's99', 's00', // portal/starter
                'ath', 'brb', 'btd', 'dkm' // late 90's box sets
            ]) },
        {
            name: 'Set completion',
            render: () => <SetCompletionReport /> },
    ];

    const getReport = (selectedId: string) => reports[Number(selectedId) - 1].render();

    return (<div>
        <Select
            value={selectedReport}
            onChange={e => setSelectedReport(e.target.value)}
        >
            <MenuItem disabled>Binders</MenuItem>
            {reports.slice(0, 11)
                .map((r,i) => <MenuItem key={r.name} value={(i+1).toString()}>{r.name}</MenuItem>)
            }
            <Divider/>
            <MenuItem disabled>Info</MenuItem>
            {reports.slice(11, 13)
                .map((r,i) => <MenuItem key={r.name} value={(i+13).toString()}>{r.name}</MenuItem>)
            }
        </Select>
        {getReport(selectedReport)}
    </div>);
}
export default ReportsPage;