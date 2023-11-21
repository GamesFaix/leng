import { Typography } from "@mui/material";
import { FC } from "react";
import { InventoryResult } from "../../../domain/inventory-search";
import { ResultDetailsTable } from "../result-details-table/result-details-table";

type Props = {
  result: InventoryResult;
};

export const ResultTooltip: FC<Props> = ({ result }) => (
  <Typography>
    {result.key.name}
    <br />
    <ResultDetailsTable result={result} />
  </Typography>
);
