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
    const [selectedReport, setSelectedReport] = React.useState("9");

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
        { name: 'All cards, by set', render: () => binderReport() },
        { name: 'Expansions 1 (Antiquities - Masques)', render: () => setsInOrderReport([
            'atq', 'leg', 'drk', 'fem', // pre-block
            'ice', 'hml', 'all', 'csp', 'cst', // ice age block
            'mir', 'vis', 'wth', // mirage block
            'tmp', 'sth', 'exo', // tempest block
            'usg', 'ulg', 'uds', // urza block
            'mmq'
        ]) },
        { name: 'Expansions 2 (Nemesis - Scourge)', render: () => setsInOrderReport([
            'nem', 'pcy',
            'inv', 'pls', 'apc', // invasion block
            'ody', 'tor', 'jud', // odyssey block
            'ons', 'lgn', 'scg' // onslaught block
        ]) },
        { name: 'Expansions 3 (Mirrodin - Avacyn Restored)', render: () => setsInOrderReport([
            'mrd', 'dst', '5dn', // mirrodin block
            'bhk', 'bok', 'sok', // kamigawa block
            'rav', 'gpt', 'dis', // ravnica block
            'tsp', 'plc', 'fut', 'tsr', // time spiral block
            'lrw', 'mor', 'shm', 'eve', // lorwyn/shadowmoor
            'ala', 'con', 'arb', // alara block
            'zen', 'wwk', 'roe', // zendikar block
            'som', 'mbs', 'nph', // scars of mirrodin block
            'isd', 'dka', 'avr' // innistrad block
        ]) },
        { name: 'Expansions 4 (Return to Ravnica - Oath of Gatewatch)', render: () => setsInOrderReport([
            'rtr', 'gtc', 'dgm', // return to ravnica block
            'ths', 'bng', 'jou', // theros block
            'ktk', 'frf', 'dtk', // tarkir block
            'bfz', 'ogw' // battle for zenikar block
        ]) },
        { name: 'Expansions 5 (Shadows over Innistrad - Eldraine)', render: () => setsInOrderReport([
            'soi', 'emn', // shadows over innistrad block
            'kld', 'aer', // kaladesh block
            'akh', 'hou', // amonkhet block
            'xln', 'rix', // ixalan block
            'dom', 'grn', 'rna', 'war', // war of the spark
            'eld'
        ]) },
        { name: 'Core 1 (Unlimied - 7E, Starter, Box Sets)', render: () => setsInOrderReport([
            '2ed', '3ed', '4ed', 'chr',
            '5ed', '6ed', '7ed',
            'por', 'p02', 'ptk', 's99', 's00', // portal/starter
            'ath', 'brb', 'btd', 'dkm' // late 90's box sets
        ]) },
        { name: 'Core 2 (8ED - M21)', render: () => setsInOrderReport([
            '8ed', '9ed', '10e',
            'm10', 'm11', 'm12', 'm13', 'm14', 'm15',
            'ori', 'm19', 'm20', 'm21'
        ]) },
        { name: 'Casual (Silver, Commander, etc.)', render: () => setsInOrderReport([
            'ugl', 'unh', 'ust',
            'bbd', 'mh1', 'cmr', 'afr', 'clb'
        ]) },
        { name: 'Set completion', render: () => <SetCompletionReport /> },
    ];

    const getReport = (selectedId: string) => reports[Number(selectedId) - 1].render();

    return (<div>
        <Select
            value={selectedReport}
            onChange={e => setSelectedReport(e.target.value)}
        >
            <MenuItem disabled>Binders</MenuItem>
            {reports.slice(0, 9)
                .map((r,i) => <MenuItem key={r.name} value={(i+1).toString()}>{r.name}</MenuItem>)
            }
            <Divider/>
            <MenuItem disabled>Info</MenuItem>
            {reports.slice(9, 11)
                .map((r,i) => <MenuItem key={r.name} value={(i+11).toString()}>{r.name}</MenuItem>)
            }
        </Select>
        {getReport(selectedReport)}
    </div>);
}
export default ReportsPage;