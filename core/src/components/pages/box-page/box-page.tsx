import { Container } from "@mui/material";
import * as React from "react";
import CardsTable from "./cards-table";
import "react-virtualized/styles.css";
import { AddCardForm, EditCardForm } from "./card-form";
import BoxHeaderCard from "./box-header-card";
import CardSelectionActionsForm from "./card-selection-actions-form";
import { CardFilterForm } from "../../common";
import { CardFilter } from "../../../domain/filters";
import { BoxCard } from "../../../domain/inventory";

type Props = {
  name: string;
  cards: BoxCard[];
  selectedKeys: string[];
  cardCount: number;
  cardToEdit: BoxCard | null;
  filter: CardFilter;
  setFilter: (filter: CardFilter) => void;
  submitScryfallSearch: () => void;
  add: (card: BoxCard) => void;
  cancelAdd: () => void;
  startEdit: (card: BoxCard) => void;
  finishEdit: (card: BoxCard) => void;
  cancelEdit: () => void;
  delete: (card: BoxCard) => void;
  save: () => void;
  bulkTransfer: (name: string) => void;
  singleTransfer: (count: number, name: string) => void;
  select: (keys: string[]) => void;
};

const BoxPage = (props: Props) => {
  return (
    <Container style={{ paddingTop: "12px" }}>
      <BoxHeaderCard
        name={props.name}
        cardCount={props.cardCount}
        save={props.save}
      />
      <br />
      <CardFilterForm
        filter={props.filter}
        onChange={props.setFilter}
        submitScryfallSearch={props.submitScryfallSearch}
      />
      <br />
      <CardSelectionActionsForm
        cards={props.cards}
        selectedKeys={props.selectedKeys}
        startEdit={props.startEdit}
        delete={props.delete}
        bulkTransferTo={props.bulkTransfer}
        singleTransferTo={props.singleTransfer}
      />
      <br />
      {props.cardToEdit === null ? (
        <AddCardForm onSubmit={props.add} onCancel={props.cancelAdd} />
      ) : (
        <EditCardForm
          card={props.cardToEdit}
          onSubmit={props.finishEdit}
          onCancel={props.cancelEdit}
        />
      )}
      <br />
      <CardsTable
        cards={props.cards}
        selectedKeys={props.selectedKeys}
        onSelectionChanged={props.select}
      />
    </Container>
  );
};
export default BoxPage;
