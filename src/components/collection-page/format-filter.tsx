import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import selectors from '../../store/selectors';

type Props = {
    value: string | null,
    onChange: (value: string | null) => void
}

function capitalize(str: string) : string {
    switch (str.length) {
        case 0: return str;
        case 1: return str.toUpperCase();
        default:
            return `${str.charAt(0).toUpperCase()}${str.substring(1)}`;
    }
}

function toDisplayName(format: string) : string {
    switch (format) {
        case "": return "(Casual)";
        case "historicbrawl": return "Historic Brawl";
        case "paupercommander": return "Pauper Commander";
        case "oldschool": return "Old School";
        case "premodern": return "Pre-modern";
        default: return capitalize(format);
    }
}

const prioritizedFormats : string[] = [
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

function getSortRank(format: string) : number {
    const priorityIndex = prioritizedFormats.indexOf(format);
    return priorityIndex >= 0 ? priorityIndex : 100;
}

function sortFormats(formats: string[]) : string[] {
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
    let formats = [ "" ];
    formats = formats.concat(useSelector(selectors.formats));
    formats = sortFormats(formats);

    function onSelect(e: SelectChangeEvent<string>) {
        const value = e.target.value === "" ? null : e.target.value;
        props.onChange(value);
    }

    return (
        <Select
            sx={{
                width: 200
            }}
            value={props.value ?? ""}
            onChange={onSelect}
        >
            {formats.map(f =>
                <MenuItem
                    key={f}
                    value={f}
                >
                    {toDisplayName(f)}
                </MenuItem>
            )}
        </Select>
    );
}
export default FormatFilter;