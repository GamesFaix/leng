import { Badge, Tooltip } from "@mui/material";
import { sumBy } from "lodash";
import { BoxCard } from "../../domain/inventory";
import { BinderCardTooltip } from "./binder-card-tooltip";
import { CardImage } from "../common";
import { CSSProperties, FC } from "react";

type Props = {
  cardGroup: BoxCard[]; // Group of cards with same name/set/collectors number, but different foil or language
  style?: CSSProperties;
};

export const BinderCard: FC<Props> = ({ cardGroup, style }) => {
  const count = sumBy(cardGroup, (c) => c.count);
  const multipleVersionSignifier = cardGroup.length > 1 ? "*" : "";
  const badgeContent = `${count}${multipleVersionSignifier}`;

  return (
    <Tooltip
      title={
        <span style={{ whiteSpace: "pre-line" }}>
          <BinderCardTooltip cardGroup={cardGroup} />
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
          <CardImage scryfallId={cardGroup[0].scryfallId} />
        </div>
      </Badge>
    </Tooltip>
  );
};
