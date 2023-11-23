import { Box, Card, IconButton, Typography } from "@mui/material";
import { FC } from "react";
import { InventoryResult } from "../../domain/inventory-search";
import { ResultDetailsTable } from "./result-details-table/result-details-table";
import { CardImage } from "../common";
import { sumBy } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../ui";

type Props = {
  result: InventoryResult;
  showImage: boolean;
  close: () => void;
};

export const ResultInspector: FC<Props> = ({ result, close, showImage }) => {
  const count = sumBy(result.cards, (c) => c.count);

  return (
    <Card sx={{ padding: 1 }}>
      <Box display="flex" alignItems="center">
        <Box flexGrow={1}>
          <Typography variant="h6">{result.key.name}</Typography>
        </Box>
        <Box>
          <IconButton onClick={close}>
            <FontAwesomeIcon icon={icons.cancel} />
          </IconButton>
        </Box>
      </Box>
      <Typography variant="body2">{`${count} copies / ${result.cards.length} variants`}</Typography>
      <ResultDetailsTable result={result} />
      <br />
      {showImage && <CardImage scryfallId={result.cards[0].scryfallId} />}
    </Card>
  );
};
