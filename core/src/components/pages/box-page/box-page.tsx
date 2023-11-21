import { Container } from "@mui/material";
import { CardsTable } from "./cards-table";
import "react-virtualized/styles.css";
import { AddCardForm, EditCardForm } from "./card-form";
import BoxHeaderCard from "./box-header-card";
import CardSelectionActionsForm from "./card-selection-actions-form";
import { InventoryQueryForm } from "../../inventory";
import { FC, useMemo } from "react";
import {
  CardSortFields,
  InventoryQuery,
} from "../../../domain/inventory-search";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "react-virtualized/styles.css";
import { inventoryActions } from "../../../store/inventory";
import { selectors } from "../../../store";
import { editingActions } from "../../../store/editing";
import { useCallback, useEffect, useState } from "react";
import { searchActions } from "../../../store/search";
import { defaultCardFilter, filterInventory } from "../../../domain/filters";
import { Box, BoxCard, areSame, getKey } from "../../../domain/inventory";

const addOrIncrememnt = (cards: BoxCard[], card: BoxCard): BoxCard[] => {
  const match = cards.find((c) => areSame(c, card));
  if (match) {
    const others = cards.filter((c) => !areSame(c, card));
    const updated = {
      ...match,
      count: match.count + card.count,
    };
    return [updated].concat(others);
  } else {
    return [card].concat(cards);
  }
};

const startingQuery: InventoryQuery = {
  filter: defaultCardFilter,
  grouping: {
    combineArts: false,
    combineFinishes: false,
    combineLanguages: false,
    combineSets: false,
  },
  sorting: {
    field: CardSortFields.Name,
    direction: "ASC",
  },
};

export const BoxPage: FC = () => {
  const { name } = useParams();

  const dispatch = useDispatch();
  const lastSavedBoxState = useSelector(selectors.box(name!));
  const allCardsBySet = useSelector(selectors.setsWithCards);

  const [oldBox, setOldBox] = useState(lastSavedBoxState);
  const [newBox, setNewBox] = useState(lastSavedBoxState);
  const [cardToEdit, setCardToEdit] = useState<BoxCard | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [query, setQuery] = useState(startingQuery);

  const cardCount = (newBox?.cards ?? [])
    .map((c) => c.count)
    .reduce((a, b) => a + b, 0);

  useEffect(() => {
    // Updated data after transfer saga finishes
    if (oldBox !== lastSavedBoxState) {
      setOldBox(lastSavedBoxState);
      setNewBox(lastSavedBoxState);
    }
  });

  const addCard = useCallback(
    (card: BoxCard) => {
      if (!newBox?.cards) {
        return;
      }
      const cards = addOrIncrememnt(newBox.cards, card);
      setNewBox({ ...newBox, cards });
      dispatch(editingActions.edit());
      setCardToEdit(null);
    },
    [newBox, setNewBox, dispatch, setCardToEdit]
  );

  const deleteCard = useCallback(
    (card: BoxCard) => {
      if (!newBox?.cards) {
        return;
      }
      const cards = newBox.cards.filter((c) => !areSame(c, card));
      setNewBox({ ...newBox, cards });
      dispatch(editingActions.edit());
      const key = getKey(card);
      if (selectedKeys.includes(key)) {
        setSelectedKeys(selectedKeys.filter((k) => k !== key));
      }
    },
    [newBox, setNewBox, dispatch, selectedKeys, setSelectedKeys]
  );

  const cancelAddOrEdit = useCallback(() => {
    if (cardToEdit) {
      addCard(cardToEdit);
      setCardToEdit(null);
    }
  }, [cardToEdit, setCardToEdit, addCard]);

  const finishEdit = useCallback(
    (card: BoxCard) => {
      addCard(card);
      if (cardToEdit) {
        setCardToEdit(null);
      }
    },
    [cardToEdit, setCardToEdit, addCard]
  );

  const checkoutToEdit = useCallback(
    (card: BoxCard) => {
      if (cardToEdit) {
        addCard(cardToEdit);
      }
      setCardToEdit(card);
      deleteCard(card);
    },
    [cardToEdit, setCardToEdit, addCard, deleteCard]
  );

  const bulkTransferTo = useCallback(
    (boxName: string) => {
      setSelectedKeys([]);
      dispatch(
        inventoryActions.boxTransferBulkStart({
          fromBoxName: name!,
          toBoxName: boxName,
          cardKeys: selectedKeys,
        })
      );
    },
    [selectedKeys, setSelectedKeys, name, dispatch]
  );

  const singleTransferTo = useCallback(
    (count: number, boxName: string) => {
      const card = newBox?.cards?.find(
        (c) => getKey(c) === selectedKeys[0]
      ) as BoxCard;

      setSelectedKeys([]);
      dispatch(
        inventoryActions.boxTransferSingleStart({
          fromBoxName: name!,
          toBoxName: boxName,
          card: { ...card, count },
        })
      );
    },
    [newBox, selectedKeys, setSelectedKeys, dispatch]
  );

  const saveBox = useCallback(() => {
    if (newBox) {
      const box: Box = {
        name: newBox.name,
        description: newBox.description ?? "",
        cards: newBox.cards ?? [],
        lastModified: newBox.lastModified,
      };
      dispatch(inventoryActions.boxSaveStart(box));
      dispatch(editingActions.reset());
    }
  }, [newBox, dispatch]);

  const cards = useMemo(
    () =>
      filterInventory(newBox ? [newBox] : [], query.filter, allCardsBySet, []),
    [newBox, query, allCardsBySet]
  );

  const submitScryfallSearch = useCallback(
    () => dispatch(searchActions.searchStart(query.filter.scryfallQuery)),
    [query, dispatch]
  );

  if (!name) {
    return <span>Invalid name</span>;
  }

  return (
    <Container style={{ paddingTop: "12px" }}>
      <BoxHeaderCard name={name} cardCount={cardCount} save={saveBox} />
      <br />
      <InventoryQueryForm
        value={query}
        onChange={setQuery}
        submitScryfallSearch={submitScryfallSearch}
      />
      <br />
      <CardSelectionActionsForm
        cards={cards}
        selectedKeys={selectedKeys}
        startEdit={checkoutToEdit}
        delete={deleteCard}
        bulkTransferTo={bulkTransferTo}
        singleTransferTo={singleTransferTo}
      />
      <br />
      {cardToEdit === null ? (
        <AddCardForm onSubmit={addCard} onCancel={cancelAddOrEdit} />
      ) : (
        <EditCardForm
          card={cardToEdit}
          onSubmit={finishEdit}
          onCancel={cancelAddOrEdit}
        />
      )}
      <br />
      <CardsTable
        cards={cards}
        selectedKeys={selectedKeys}
        onSelectionChanged={setSelectedKeys}
      />
    </Container>
  );
};
