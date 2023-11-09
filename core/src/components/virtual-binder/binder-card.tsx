import { Badge, Tooltip } from "@mui/material";
import { sumBy } from "lodash";
import * as React from "react";
import { BoxCard } from "../../domain/inventory";
import BinderCardTooltip from "./binder-card-tooltip";
import { CardImage } from "../common";

type Props = {
  cardGroup: BoxCard[]; // Group of cards with same name/set/collectors number, but different foil or language
  style?: React.CSSProperties;
};

const BinderCard = (props: Props) => {
  const count = sumBy(props.cardGroup, (c) => c.count);
  const multipleVersionSignifier = props.cardGroup.length > 1 ? "*" : "";
  const badgeContent = `${count}${multipleVersionSignifier}`;

  return (
    <Tooltip
      title={
        <span style={{ whiteSpace: "pre-line" }}>
          <BinderCardTooltip cardGroup={props.cardGroup} />
        </span>
      }
    >
      <Badge color="secondary" badgeContent={badgeContent} overlap="circular">
        <div
          style={{
            ...props.style,
            overflow: "clip",
          }}
        >
          <CardImage scryfallId={props.cardGroup[0].scryfallId} />
        </div>
      </Badge>
    </Tooltip>
  );
};
export default BinderCard;
