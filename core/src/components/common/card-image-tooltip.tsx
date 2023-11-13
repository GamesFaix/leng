import { Tooltip } from "@mui/material";
import { CardImage } from "./card-image";
import { ReactElement } from "react";

type Props = {
  scryfallId: string;
  children: ReactElement;
};

export const CardImageTooltip = (props: Props) => (
  <Tooltip
    title={
      <div style={{ width: "125px", height: "175px" }}>
        <CardImage scryfallId={props.scryfallId} />
      </div>
    }
  >
    {props.children}
  </Tooltip>
);
