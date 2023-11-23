import { Card } from "@mui/material";
import { FC } from "react";
import { InventoryResult } from "../../domain/inventory-search";
import { ResultDetailsTable } from "./result-details-table/result-details-table";

type Props = {
  result: InventoryResult;
  close: () => void;
};

export const ResultInspector: FC<Props> = ({ result, close }) => {
  return (
    <Card sx={{ padding: 1 }}>
      {result.key.name}
      <br />
      <ResultDetailsTable result={result} />
    </Card>
  );
};
