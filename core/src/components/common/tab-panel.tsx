import { Box, Typography } from "@mui/material";
import { ReactElement } from "react";

type Props = {
  children: ReactElement;
  hidden?: boolean;
};

export const TabPanel = (props: Props) => {
  return (
    <div role="tabpanel" hidden={props.hidden}>
      {!props.hidden && (
        <Box sx={{ p: 3 }}>
          <Typography>{props.children}</Typography>
        </Box>
      )}
    </div>
  );
};
