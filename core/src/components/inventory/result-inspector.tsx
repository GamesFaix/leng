import { Card, Typography } from "@mui/material";
import { FC } from "react";
import { InventoryResult } from "../../domain/inventory-search";
import { ResultDetailsTable } from "./result-details-table/result-details-table";
import { CardImage } from "../common";
import { sumBy } from "lodash";

type Props = {
  result: InventoryResult;
  showImage: boolean;
  close: () => void;
};

export const ResultInspector: FC<Props> = ({ result, close, showImage }) => {
  const count = sumBy(result.cards, c => c.count);

  return (
    <Card sx={{ padding: 1 }}>
      <Typography variant="h6">{result.key.name}</Typography>
      <Typography variant="body2">{`${count} copies / ${result.cards.length} variants`}</Typography>
      <ResultDetailsTable result={result} />
      <br />
      {showImage && <CardImage scryfallId={result.cards[0].scryfallId} />}
    </Card>
  );
};
