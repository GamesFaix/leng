import { Box, Card, IconButton, Typography } from "@mui/material";
import { CSSProperties, FC } from "react";
import {
  InventoryResult,
  InventoryResultKey,
} from "../../domain/inventory-search";
import { ResultDetailsTable } from "./result-details-table/result-details-table";
import { CardImage } from "../common";
import { capitalize, sumBy } from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../ui";

type Props = {
  result: InventoryResult;
  showImage: boolean;
  close: () => void;
  style?: CSSProperties;
};

const getResultKeyDescription = (key: InventoryResultKey) => {
  let desc = "";
  if (key.setCode) {
    desc += `${key.setCode.toUpperCase()} `;
  }
  if (key.collectorsNumber) {
    desc += `#${key.collectorsNumber} `;
  }
  if (key.finish) {
    desc += `${capitalize(key.finish)} `;
  }
  if (key.lang) {
    desc += key.lang;
  }
  return desc;
};

export const ResultInspector: FC<Props> = ({
  result,
  close,
  showImage,
  style,
}) => {
  const count = sumBy(result.cards, (c) => c.count);

  return (
    <Card sx={{ padding: 1 }} style={style}>
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
      <Typography variant="body2">
        {getResultKeyDescription(result.key)}
      </Typography>
      <Typography variant="body2">{`${count} copies / ${result.cards.length} variants`}</Typography>
      <ResultDetailsTable result={result} />
      <br />
      {showImage && <CardImage scryfallId={result.cards[0].scryfallId} />}
    </Card>
  );
};
