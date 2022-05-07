import { MenuItem, Select } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import selectors from '../../store/selectors';

type FormatName = string | null;

type Props = {
    value: FormatName,
    onChange: (value: FormatName) => void
}

function capitalize(str: string) : string {
    switch (str.length) {
        case 0: return str;
        case 1: return str.toUpperCase();
        default:
            return `${str.charAt(0).toUpperCase()}${str.substring(1)}`;
    }
}

function toDisplayName(format: FormatName) : string {
    switch (format) {
        case null: return "(Casual)";
        case "historicbrawl": return "Historic Brawl";
        case "paupercommander": return "Pauper Commander";
        case "oldschool": return "Old School";
        case "premodern": return "Pre-modern";
        default: return capitalize(format);
    }
}

const prioritizedFormats : FormatName[] = [
    null,
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

function getSortRank(format: FormatName) : number {
    const priorityIndex = prioritizedFormats.indexOf(format);
    return priorityIndex >= 0 ? priorityIndex : 100;
}

function sortFormats(formats: FormatName[]) : FormatName[] {
    const withRanks = formats.map(f => { return { format: f, rank: getSortRank(f) }});

    const sorted = withRanks
        .sort((a, b) => {
            if (a.rank < b.rank) return -1;
            if (a.rank > b.rank) return 1;
            if ((a.format ?? "") < (b.format ?? "")) return -1;
            if ((a.format ?? "") > (b.format ?? "")) return 1;
            return 0;
        });

    return sorted.map(x => x.format);
}

const FormatFilter = (props: Props) => {
    let formats : FormatName[] = [ null ];
    formats = formats.concat(useSelector(selectors.formats));
    formats = sortFormats(formats);

    return (
        <Select
            sx={{
                width: 200
            }}
            value={props.value}
            onChange={e => props.onChange(e.target.value ?? null)}
        >
            {formats.map(f =>
                <MenuItem
                    key={f ?? "(null)"}
                    value={f ?? undefined}
                >
                    {toDisplayName(f)}
                </MenuItem>
            )}
        </Select>
    );
}
export default FormatFilter;