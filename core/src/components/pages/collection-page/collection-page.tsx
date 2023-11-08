import { Card, Container, IconButton, Typography } from "@mui/material";
import CardsTable from "./cards-table";
import { BoxCard, CardFilter } from "../../../logic/model";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../../ui/fontawesome";
import { CardFilterForm } from "../../common";
import * as React from 'react'

type Props = {
  cards: BoxCard[];
  cardCount: number;
  filter: CardFilter;
  setFilter: (filter: CardFilter) => void;
  exportTappedOutCsv: () => void;
  exportWebJson: () => void;
  submitScryfallSearch: () => void;
};

const CollectionPage = (props: Props) => {
  return (
    <Container style={{ paddingTop: "12px" }}>
      <div style={{ display: "flex" }}>
        <div>
          <Typography variant="h4">Collection</Typography>
          <Typography sx={{ fontStyle: "italic" }}>
            {props.cardCount} cards
          </Typography>
        </div>
        <div>
          <IconButton
            title="Export TappedOut CSV"
            color="primary"
            onClick={() => props.exportTappedOutCsv()}
          >
            <FontAwesomeIcon icon={icons.export} />
          </IconButton>
          <IconButton
            title="Export Leng-Web JSON"
            color="primary"
            onClick={() => props.exportWebJson()}
          >
            <FontAwesomeIcon icon={icons.export} />
          </IconButton>
        </div>
      </div>
      <br />
      <CardFilterForm
        filter={props.filter}
        onChange={props.setFilter}
        submitScryfallSearch={props.submitScryfallSearch}
      />
      <br />
      <Card sx={{ padding: 1 }}>
        <CardsTable cards={props.cards} />
      </Card>
    </Container>
  );
};
export default CollectionPage;
