import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import {
  Box,
  BoxCard,
  BoxCardModule,
  defaultCardFilter,
} from "leng-core/src/logic/model";
import "react-virtualized/styles.css";
import { inventoryActions } from "leng-core/src/store/inventory";
import BoxPage from "./box-page";
import { selectors } from "leng-core/src/store";
import { editingActions } from "leng-core/src/store/editing";
import { getCards } from "leng-core/src/logic/card-filters";
import { useCallback } from "react";
import { searchActions } from "leng-core/src/store/search";

function addOrIncrememnt(cards: BoxCard[], card: BoxCard): BoxCard[] {
  const match = cards.find((c) => BoxCardModule.areSame(c, card));
  if (match) {
    const others = cards.filter((c) => !BoxCardModule.areSame(c, card));
    const updated = {
      ...match,
      count: match.count + card.count,
    };
    return [updated].concat(others);
  } else {
    return [card].concat(cards);
  }
}

const BoxPageContainer = () => {
  const { name } = useParams();

  const dispatch = useDispatch();
  const lastSavedBoxState = useSelector(selectors.box(name!));
  const allCardsBySet = useSelector(selectors.setsWithCards);

  const [oldBox, setOldBox] = React.useState(lastSavedBoxState);
  const [newBox, setNewBox] = React.useState(lastSavedBoxState);
  const [cardToEdit, setCardToEdit] = React.useState<BoxCard | null>(null);
  const [selectedKeys, setSelectedKeys] = React.useState<string[]>([]);
  const [filter, setFilter] = React.useState(defaultCardFilter);

  const cardCount = (newBox?.cards ?? [])
    .map((c) => c.count)
    .reduce((a, b) => a + b, 0);

  React.useEffect(() => {
    // Updated data after transfer saga finishes
    if (oldBox !== lastSavedBoxState) {
      setOldBox(lastSavedBoxState);
      setNewBox(lastSavedBoxState);
    }
  });

  function cancel() {
    if (cardToEdit) {
      addCard(cardToEdit);
      setCardToEdit(null);
    }
  }

  function submit(card: BoxCard) {
    addCard(card);
    if (cardToEdit) {
      setCardToEdit(null);
    }
  }

  function checkout(card: BoxCard) {
    if (cardToEdit) {
      addCard(cardToEdit);
    }
    setCardToEdit(card);
    deleteCard(card);
  }

  function addCard(card: BoxCard) {
    if (!newBox?.cards) {
      return;
    }
    const cards = addOrIncrememnt(newBox.cards, card);
    setNewBox({ ...newBox, cards });
    dispatch(editingActions.edit());
    setCardToEdit(null);
  }

  function deleteCard(card: BoxCard) {
    if (!newBox?.cards) {
      return;
    }
    const cards = newBox.cards.filter((c) => !BoxCardModule.areSame(c, card));
    setNewBox({ ...newBox, cards });
    dispatch(editingActions.edit());
    const key = BoxCardModule.getKey(card);
    if (selectedKeys.includes(key)) {
      setSelectedKeys(selectedKeys.filter((k) => k !== key));
    }
  }

  function bulkTransferTo(boxName: string) {
    setSelectedKeys([]);
    dispatch(
      inventoryActions.boxTransferBulkStart({
        fromBoxName: name!,
        toBoxName: boxName,
        cardKeys: selectedKeys,
      })
    );
  }

  function singleTransferTo(count: number, boxName: string) {
    const card = newBox?.cards?.find(
      (c) => BoxCardModule.getKey(c) === selectedKeys[0]
    ) as BoxCard;

    setSelectedKeys([]);
    dispatch(
      inventoryActions.boxTransferSingleStart({
        fromBoxName: name!,
        toBoxName: boxName,
        card: { ...card, count },
      })
    );
  }

  function save() {
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
  }

  const cards = getCards(newBox ? [newBox] : [], filter, allCardsBySet, []);

  const search = useCallback(
    () => dispatch(searchActions.searchStart(filter.scryfallQuery)),
    [filter.scryfallQuery, dispatch]
  );

  return (
    <BoxPage
      name={name!}
      cards={cards}
      cardCount={cardCount}
      cardToEdit={cardToEdit}
      selectedKeys={selectedKeys}
      filter={filter}
      setFilter={setFilter}
      submitScryfallSearch={search}
      add={submit}
      cancelAdd={cancel}
      startEdit={checkout}
      finishEdit={submit}
      cancelEdit={cancel}
      delete={deleteCard}
      save={save}
      bulkTransfer={bulkTransferTo}
      singleTransfer={singleTransferTo}
      select={setSelectedKeys}
    />
  );
};
export default BoxPageContainer;
