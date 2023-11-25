import { Card, Container, Typography } from "@mui/material";
import { SetCompletionPanel } from "../../set-completion-panel";
import SetBinderPanel from "./set-binder-panel";
import SetSelector from "./set-selector";
import { useCallback, useState } from "react";

const someSetView = (selectedParentSetCode: string | null) => (
  <>
    <Card style={{ padding: "6px" }}>
      <Typography variant="h5">Binder</Typography>
      <SetBinderPanel parentSetCode={selectedParentSetCode} />
    </Card>
    <br />
    <Card style={{ padding: "6px" }}>
      <Typography variant="h5">Stats</Typography>
      <SetCompletionPanel parentSetCode={selectedParentSetCode} />
    </Card>
  </>
);

export const ReportsPage = () => {
  const [selectedParentSetCode, setSelectedParentSetCode] = useState<
    string | null
  >(null);

  const onSetSelected = useCallback(
    (code: string | null) => {
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
