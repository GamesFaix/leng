import { MenuItem, Select, SelectChangeEvent } from '@mui/material';
import { ColorFilterRule, allColorFilterRules } from 'leng-core/src/logic/model';
import * as React from 'react';

type Props = {
    value: ColorFilterRule,
    onChange: (value: ColorFilterRule) => void
}

function formatRule(rule: ColorFilterRule) {
    switch (rule) {
        case ColorFilterRule.ContainsAll: return 'All of';
        case ColorFilterRule.ContainsAny: return 'Any of';
        case ColorFilterRule.ContainsOnly: return 'Only';
        case ColorFilterRule.IsExactly: return 'Is exactly';
        case ColorFilterRule.IdentityContainsAll: return 'Identity contains all of';
        case ColorFilterRule.IdentityContainsAny: return 'Identity contains any of';
        case ColorFilterRule.IdentityContainsOnly: return 'Identity contains only';
        case ColorFilterRule.IdentityIsExactly: return 'Identity is exactly';
    }
}

const ColorRuleSelector = (props: Props) => {
    function onChange(e: SelectChangeEvent) {
        const value = e.target.value as ColorFilterRule;
        props.onChange(value);
    }

    return (
        <Select
            sx={{
                width: 200
            }}
            value={props.value as any}
            onChange={onChange}
        >
            {allColorFilterRules.map(r =>
                <MenuItem
                    key={r}
                    value={r}
                >
                    {formatRule(r)}
                </MenuItem>
            )}
        </Select>
    );
}
export default ColorRuleSelector;