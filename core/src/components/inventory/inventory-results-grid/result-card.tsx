import { Badge } from "@mui/material";
import { sumBy } from "lodash";
import { CardImage } from "../../common";
import { CSSProperties, FC } from "react";
import { InventoryResult } from "../../../domain/inventory-search";

// TODO: Use a pop-out panel instead of a tooltip
// TODO: Badge misplaced

type Props = {
  result: InventoryResult;
  style?: CSSProperties;
  onClick: () => void;
};

export const ResultCard: FC<Props> = ({ result, style, onClick }) => {
  const count = sumBy(result.cards, (c) => c.count);
  const multipleVersionSignifier = result.cards.length > 1 ? "*" : "";
  const badgeContent = `${count}${multipleVersionSignifier}`;

  return (
    <Badge color="secondary" badgeContent={badgeContent} overlap="circular">
      <div
        style={{
          ...style,
          overflow: "clip",
        }}
      >
        <CardImage scryfallId={result.cards[0].scryfallId} onClick={onClick} />
      </div>
    </Badge>
  );
};
