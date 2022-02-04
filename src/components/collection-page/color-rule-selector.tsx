import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import * as React from 'react';

export enum ColorFilterRule {
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
    ColorFilterRule.ContainsAny,
    ColorFilterRule.ContainsAll,
    ColorFilterRule.ContainsOnly,
    ColorFilterRule.IsExactly,
    ColorFilterRule.IdentityContainsAny,
    ColorFilterRule.IdentityContainsAll,
    ColorFilterRule.IdentityContainsOnly,
    ColorFilterRule.IdentityIsExactly
];

type Props = {
    value: ColorFilterRule,
    onChange: (value: ColorFilterRule) => void
}

const ColorRuleSelector = (props: Props) => {
    function onChange(e: SelectChangeEvent) {
        const value = e.target.value as ColorFilterRule;
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
export default ColorRuleSelector;