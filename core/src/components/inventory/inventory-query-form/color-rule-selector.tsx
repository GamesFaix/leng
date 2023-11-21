import { MenuItem, Select } from "@mui/material";
import { ColorFilterRule, allColorFilterRules } from "../../../domain/filters";
import { FC } from "react";

type Props = {
  value: ColorFilterRule;
  onChange: (value: ColorFilterRule) => void;
};

const formatRule = (rule: ColorFilterRule) => {
  switch (rule) {
    case ColorFilterRule.ContainsAll:
      return "All of";
    case ColorFilterRule.ContainsAny:
      return "Any of";
    case ColorFilterRule.ContainsOnly:
      return "Only";
    case ColorFilterRule.IsExactly:
      return "Is exactly";
    case ColorFilterRule.IdentityContainsAll:
      return "Identity contains all of";
    case ColorFilterRule.IdentityContainsAny:
      return "Identity contains any of";
    case ColorFilterRule.IdentityContainsOnly:
      return "Identity contains only";
    case ColorFilterRule.IdentityIsExactly:
      return "Identity is exactly";
  }
};

export const ColorRuleSelector: FC<Props> = ({ value, onChange }) => (
  <Select
    sx={{
      width: 200,
    }}
    value={value as any}
    onChange={(e) => onChange(e.target.value as ColorFilterRule)}
  >
    {allColorFilterRules.map((r) => (
      <MenuItem key={r} value={r}>
        {formatRule(r)}
      </MenuItem>
    ))}
  </Select>
);
