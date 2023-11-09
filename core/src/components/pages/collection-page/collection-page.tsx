import { Card, Container, IconButton, Typography } from "@mui/material";
import CardsTable from "./cards-table";
import { BoxCard, CardFilter } from "../../../logic/model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../../ui/fontawesome";
import { CardFilterForm } from "../../common";
import * as React from "react";
import { useCapabilities } from "../../../hooks";

type Props = {
  cards: BoxCard[];
  cardCount: number;
  filter: CardFilter;
  setFilter: (filter: CardFilter) => void;
  exportTappedOutCsv: () => void;
  exportWebJson: () => void;
  submitScryfallSearch: () => void;
};

const ExportButtons: React.FC<Partial<Props>> = ({
  exportTappedOutCsv,
  exportWebJson,
}) => {
  const caps = useCapabilities();

  return (
    <div>
      {exportTappedOutCsv && caps.export?.tappedOutCsv && (
        <IconButton
          title="Export TappedOut CSV"
          color="primary"
          onClick={() => exportTappedOutCsv()}
        >
          <FontAwesomeIcon icon={icons.export} />
        </IconButton>
      )}
      {exportWebJson && caps.export?.webJson && (
        <IconButton
          title="Export Leng-Web JSON"
          color="primary"
          onClick={() => exportWebJson()}
        >
          <FontAwesomeIcon icon={icons.export} />
        </IconButton>
      )}
    </div>
  );
};

const CollectionPage: React.FC<Props> = ({
  exportTappedOutCsv,
  exportWebJson,
  cardCount,
  filter,
  setFilter,
  submitScryfallSearch,
  cards,
}) => {
  return (
    <Container style={{ paddingTop: "12px" }}>
      <div style={{ display: "flex" }}>
        <div>
          <Typography variant="h4">Collection</Typography>
          <Typography sx={{ fontStyle: "italic" }}>
            {cardCount} cards
          </Typography>
        </div>
        <ExportButtons
          exportTappedOutCsv={exportTappedOutCsv}
          exportWebJson={exportWebJson}
        />
      </div>
      <br />
      <CardFilterForm
        filter={filter}
        onChange={setFilter}
        submitScryfallSearch={submitScryfallSearch}
      />
      <br />
      <Card sx={{ padding: 1 }}>
        <CardsTable cards={cards} />
      </Card>
    </Container>
  );
};
export default CollectionPage;
