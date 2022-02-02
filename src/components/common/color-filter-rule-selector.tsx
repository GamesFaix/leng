import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import * as React from 'react';

export enum Rule {
    ContainsAny = 'CONTAINS_ANY',
    ContainsAll = 'CONTAINS_ALL',
    ContainsOnly = 'CONTAINS_ONLY',
    IsExactly = 'IS_EXACTLY',
    IdentityContainsAny = 'IDENTITY_CONTAINS_ANY',
    IdentityContainsAll = 'IDENTITY_CONTAINS_ALL',
    IdentityContainsOnly = 'IDENTITY_CONTAINS_ONLY',
    IdentityIsExactly = 'IDENTITY_IS_EXACTLY'
}

const allRules = [
    Rule.ContainsAny,
    Rule.ContainsAll,
    Rule.ContainsOnly,
    Rule.IsExactly,
    Rule.IdentityContainsAny,
    Rule.IdentityContainsAll,
    Rule.IdentityContainsOnly,
    Rule.IdentityIsExactly
];

type Props = {
    value: Rule,
    onChange: (value: Rule) => void
}

const ColorFilterRuleSelector = (props: Props) => {
    function onChange(e: SelectChangeEvent) {
        const value = e.target.value as Rule;
        props.onChange(value);
    }

    return (
        <Select
            value={props.value as any}
            onChange={onChange}
        >
            {allRules.map(r =>
                <MenuItem
                    key={r}
                    value={r}
                >
                    {r}
                </MenuItem>
            )}
        </Select>
    );
}
export default ColorFilterRuleSelector;