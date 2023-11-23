import { Card } from "@mui/material";
import { FC } from "react";
import { InventoryResult } from "../../domain/inventory-search";
import { ResultDetailsTable } from "./result-details-table/result-details-table";
import { CardImage } from "../common";

type Props = {
  result: InventoryResult;
  showImage: boolean;
  close: () => void;
};

export const ResultInspector: FC<Props> = ({ result, close, showImage }) => {
  return (
    <Card sx={{ padding: 1 }}>
      {result.key.name}
      <br />
      <ResultDetailsTable result={result} />
      <br />
      {showImage && <CardImage scryfallId={result.cards[0].scryfallId} />}
    </Card>
  );
};
