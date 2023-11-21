import { Badge, Tooltip } from "@mui/material";
import { sumBy } from "lodash";
import { CardImage } from "../../common";
import { CSSProperties, FC } from "react";
import { ResultTooltip } from "./result-tooltip";
import { InventoryResult } from "../../../domain/inventory-search";

type Props = {
  result: InventoryResult;
  style?: CSSProperties;
};

export const ResultCard: FC<Props> = ({ result, style }) => {
  const count = sumBy(result.cards, (c) => c.count);
  const multipleVersionSignifier = result.cards.length > 1 ? "*" : "";
  const badgeContent = `${count}${multipleVersionSignifier}`;

  return (
    <Tooltip
      title={
        <span style={{ whiteSpace: "pre-line" }}>
          <ResultTooltip result={result} />
        </span>
      }
    >
      <Badge color="secondary" badgeContent={badgeContent} overlap="circular">
        <div
          style={{
            ...style,
            overflow: "clip",
          }}
        >
          <CardImage scryfallId={result.cards[0].scryfallId} />
        </div>
      </Badge>
    </Tooltip>
  );
};
