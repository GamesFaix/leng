import { MenuItem, Select } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { BoxCard } from '../../logic/model';
import selectors from '../../store/selectors';
import BinderBySetReport from './binder-by-set-report';
import { Set, SetType } from 'scryfall-api';

type SetTypeKey = keyof typeof SetType

const ReportsPage = () => {
    const boxes = useSelector(selectors.boxes);
    const sets = useSelector(selectors.sets);
    const [selectedReport, setSelectedReport] = React.useState("1");

    function binderReport(filter ?: (c:BoxCard) => boolean) {
        return <BinderBySetReport boxes={boxes} filter={filter}/>;
    }

    function binderOfSetsReport(filter: (s:Set) => boolean) {
        const filteredSetAbbrevs = sets.filter(filter).map(s => s.code);
        const cardFilter = (c:BoxCard) => filteredSetAbbrevs.includes(c.setAbbrev);
        return binderReport(cardFilter);
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

    function getReport(selectedId: string) {
        switch (selectedId) {
            case "1": return binderReport();
            case "2": return binderOfSetsReport(s =>
                isOfTypes(s, [ 'core', 'expansion', 'masters' ]) && // Masters for Chronicles
                isBetween(s, '1993-01-01', '1997-04-01'));
            case "3": return binderOfSetsReport(s =>
                isOfTypes(s, [ 'core', 'expansion' ]) &&
                isBetween(s, '1997-04-01', '2000-07-01'));
            case "4": return binderOfSetsReport(s =>
                isOfTypes(s, [ 'core', 'expansion' ]) &&
                isBetween(s, '2000-07-01', '2003-06-01'));
            case "5": return binderOfSetsReport(s =>
                isOfTypes(s, [ 'core', 'expansion' ]) &&
                isBetween(s, '2003-06-01', '2011-06-01'));
            case "6": return binderOfSetsReport(s =>
                isOfTypes(s, [ 'core', 'expansion' ]) &&
                isBetween(s, '2011-06-01', '2014-09-01'));
            case "7": return binderOfSetsReport(s =>
                anyOf(s, ['dom', 'mh1', 'm19', 'm20', 'm21', 'tsr', 'cmr', 'eld', 'afr', 'clb']));
            case "8": return binderOfSetsReport(s =>
                (s.set_type === 'starter' && isBetween(s, '1993-01-01', '2001-01-01'))
                || (s.set_type === 'funny' && isBetween(s, '1993-01-01', '2005-01-01'))
                || (s.set_type === 'box' && isBetween(s, '1993-01-01', '2002-01-01'))
                || s.code === 'cst' /* coldsnap decks */);
            default: return <></>;
        }
    }

    return (<div>
        <Select
            value={selectedReport}
            onChange={e => setSelectedReport(e.target.value)}
        >
            <MenuItem disabled>Binders</MenuItem>
            <MenuItem value="1">All cards, by set"</MenuItem>
            <MenuItem value="2">Old School (Alpha - 5ED)</MenuItem>
            <MenuItem value="3">Weatherlight Saga (Weatherlight - Prophecy)</MenuItem>
            <MenuItem value="4">Apocalypses (Invasion - Scourge)</MenuItem>
            <MenuItem value="5">Early Modern (8ED - New Phyrexia)</MenuItem>
            <MenuItem value="6">Modern 2 (M12 - Journey Into Nyx)</MenuItem>
            <MenuItem value="7">Pioneer (Dominaria, misc.)</MenuItem>
            <MenuItem value="8">Silver, Starter, and Boxed Sets</MenuItem>
        </Select>
        {getReport(selectedReport)}
    </div>);
}
export default ReportsPage;