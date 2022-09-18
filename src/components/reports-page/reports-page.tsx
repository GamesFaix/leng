import { Divider, MenuItem, Select } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { BoxCard } from '../../logic/model';
import selectors from '../../store/selectors';
import BinderBySetReport from './binder-by-set-report';
import { Set } from 'scryfall-api';
import SetCompletionReport from './set-completion-report';

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

    function getReport(selectedId: string) {
        switch (selectedId) {
            case "1": return binderReport();

            case "2": return setsInOrderReport([
                'atq', 'leg', 'drk', 'fem', // pre-block
                'ice', 'hml', 'all', 'csp', 'cst', // ice age block
                'mir', 'vis', 'wth', // mirage block
                'tmp', 'sth', 'exo', // tempest block
                'usg', 'ulg', 'uds', // urza block
                'mmq'
            ]);

            case "3": return setsInOrderReport([
                'nem', 'pcy',
                'inv', 'pls', 'apc', // invasion block
                'ody', 'tor', 'jud', // odyssey block
                'ons', 'lgn', 'scg' // onslaught block
            ]);

            case "4": return setsInOrderReport([
                'mrd', 'dst', '5dn', // mirrodin block
                'bhk', 'bok', 'sok', // kamigawa block
                'rav', 'gpt', 'dis', // ravnica block
                'tsp', 'plc', 'fut', 'tsr', // time spiral block
                'lrw', 'mor', 'shm', 'eve', // lorwyn/shadowmoor
                'ala', 'con', 'arb', // alara block
                'zen', 'wwk', 'roe', // zendikar block
                'som', 'mbs', 'nph', // scars of mirrodin block
                'isd', 'dka', 'avr' // innistrad block
            ]);

            case "5": return setsInOrderReport([
                'rtr', 'gtc', 'dgm', // return to ravnica block
                'ths', 'bng', 'jou', // theros block
                'ktk', 'frf', 'dtk', // tarkir block
                'bfz', 'ogw' // battle for zenikar block
            ]);

            case "6": return setsInOrderReport([
                'soi', 'emn', // shadows over innistrad block
                'kld', 'aer', // kaladesh block
                'akh', 'hou', // amonkhet block
                'xln', 'rix', // ixalan block
                'dom', 'grn', 'rna', 'war', // war of the spark
                'eld'
            ]);

            case "7": return setsInOrderReport([
                '2ed', '3ed', '4ed', 'chr',
                '5ed', '6ed', '7ed',
                'por', 'p02', 'ptk', 's99', 's00', // portal/starter
                'ath', 'brb', 'btd', 'dkm' // late 90's box sets
            ]);

            case "8": return setsInOrderReport([
                '8ed', '9ed', '10e',
                'm10', 'm11', 'm12', 'm13', 'm14', 'm15',
                'ori', 'm19', 'm20', 'm21'
            ]);

            case "9": return setsInOrderReport([
                'ugl', 'unh', 'ust',
                'bbd', 'mh1', 'cmr', 'afr', 'clb'
            ]);

            case "10": return <SetCompletionReport />;

            default: return <></>;
        }
    }

    return (<div>
        <Select
            value={selectedReport}
            onChange={e => setSelectedReport(e.target.value)}
        >
            <MenuItem disabled>Binders</MenuItem>
            <MenuItem value="1">All cards, by set</MenuItem>
            <MenuItem value="2">Expansions 1 (Antiquities - Masques)</MenuItem>
            <MenuItem value="3">Expansions 2 (Nemesis - Scourge)</MenuItem>
            <MenuItem value="4">Expansions 3 (Mirrodin - Avacyn Restored)</MenuItem>
            <MenuItem value="5">Expansions 4 (Return to Ravnica - Oath of Gatewatch)</MenuItem>
            <MenuItem value="6">Expansions 5 (Shadows over Innistrad - Eldraine)</MenuItem>
            <MenuItem value="7">Core 1 (Unlimied - 7E, Starter, Box Sets)</MenuItem>
            <MenuItem value="8">Core 2 (8ED - M21)</MenuItem>
            <MenuItem value="9">Casual (Silver, Commander, etc.)</MenuItem>
            {/* <MenuItem value="10"></MenuItem> */}
            <Divider/>
            <MenuItem disabled>Info</MenuItem>
            <MenuItem value="10">Set completion</MenuItem>
        </Select>
        {getReport(selectedReport)}
    </div>);
}
export default ReportsPage;