import { Card, Container, Typography } from "@mui/material";
import * as React from "react";
import SetStatsPanel from "./set-stats-panel";
import SetBinderPanel from "./set-binder-panel";
import SetSelector from "./set-selector";

const someSetView = (selectedParentSetCode: string | null) => (<>
  <Card style={{ padding: "6px" }}>
    <Typography variant="h5">Binder</Typography>
    <SetBinderPanel parentSetCode={selectedParentSetCode} />
  </Card>
  <br />
  <Card style={{ padding: "6px" }}>
    <Typography variant="h5">Stats</Typography>
    <SetStatsPanel parentSetCode={selectedParentSetCode} />
  </Card>
</>);

const ReportsPage = () => {
  const [selectedParentSetCode, setSelectedParentSetCode] = React.useState<
    string | null
  >(null);

  const onSetSelected = React.useCallback(
    (code) => {
      if (code === selectedParentSetCode) return;
      setSelectedParentSetCode(code);
    },
    [setSelectedParentSetCode]
  );

  return (
    <Container style={{ paddingTop: "12px" }} maxWidth="xl">
      <SetSelector
        selectedSetCode={selectedParentSetCode}
        setSelectedSetCode={onSetSelected}
      />
      <br />
      {selectedParentSetCode ? someSetView(selectedParentSetCode) : null}
    </Container>
  );
};
export default ReportsPage;
