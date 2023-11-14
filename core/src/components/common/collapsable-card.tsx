import { Card, Collapse, SxProps, Typography } from "@mui/material";
import { Theme } from "@mui/system";
import ExpandCollapseButton from "./expand-collapse-button";
import { useState } from "react";

type Props = {
  title: string;
  sx?: SxProps<Theme>;
  children: JSX.Element | JSX.Element[];
};

export const CollapsableCard = ({ title, sx, children }: Props) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card sx={{ padding: 1, ...sx }}>
      <div style={{ display: "flex" }}>
        <Typography variant="h5">{title}</Typography>
        <ExpandCollapseButton
          isExpanded={expanded}
          onClick={() => setExpanded(!expanded)}
        />
      </div>
      <Collapse in={expanded}>{children}</Collapse>
    </Card>
  );
};
