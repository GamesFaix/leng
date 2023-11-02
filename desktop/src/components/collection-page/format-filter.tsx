import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { customFormats, emptyFormat, Format, FormatType } from '../../logic/formats';
import selectors from '../../store/selectors';

type Props = {
    value: Format | null,
    onChange: (value: Format | null) => void
}

function capitalize(str: string) : string {
    switch (str.length) {
        case 0: return str;
        case 1: return str.toUpperCase();
        default:
            return `${str.charAt(0).toUpperCase()}${str.substring(1)}`;
    }
}

function toDisplayName(format: Format) : string {
    switch (format.name) {
        case "": return "(Casual)";
        case "historicbrawl": return "Historic Brawl";
        case "paupercommander": return "Pauper Commander";
        case "oldschool": return "Old School";
        case "premodern": return "Pre-modern";
        default: return capitalize(format.name);
    }
}

const prioritizedFormatNames : string[] = [
    "",
    "commander",
    "standard",
    "pioneer",
    "modern",
    "legacy",
    "vintage",
    "premodern",
    "oldschool",
    "pauper"
];

function getSortRank(format: Format) : number {
    const priorityIndex = prioritizedFormatNames.indexOf(format.name);
    return priorityIndex >= 0 ? priorityIndex : 100;
}

function sortFormats(formats: Format[]) : Format[] {
    const withRanks = formats.map(f => { return { format: f, rank: getSortRank(f) }});

    const sorted = withRanks
        .sort((a, b) => {
            if (a.rank < b.rank) return -1;
            if (a.rank > b.rank) return 1;
            if (a.format < b.format) return -1;
            if (a.format > b.format) return 1;
            return 0;
        });

    return sorted.map(x => x.format);
}

const FormatFilter = (props: Props) => {
    const standardFormats : Format[] =  useSelector(selectors.formats)
        .map(name => ({ type: FormatType.Standard, name }));

    const sortedFormats = React.useMemo(() =>
        sortFormats([emptyFormat].concat(standardFormats).concat(customFormats)),
    [standardFormats]);

    const onSelect = React.useCallback((e: SelectChangeEvent<string>) => {
        const name = e.target.value === "" ? null : e.target.value;
        const format = sortedFormats.find(f => f.name === name) ?? null;
        props.onChange(format);
    }, [standardFormats, sortedFormats, props.onChange]);

    return (
        <Select
            sx={{
                width: 200
            }}
            value={props.value?.name ?? ""}
            onChange={onSelect}
        >
            {sortedFormats.map(f =>
                <MenuItem
                    key={f.name}
                    value={f.name}
                >
                    {toDisplayName(f)}
                </MenuItem>
            )}
        </Select>
    );
}
export default FormatFilter;