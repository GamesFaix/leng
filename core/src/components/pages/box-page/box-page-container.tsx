import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import "react-virtualized/styles.css";
import { inventoryActions } from "../../../store/inventory";
import BoxPage from "./box-page";
import { selectors } from "../../../store";
import { editingActions } from "../../../store/editing";
import { useCallback, useEffect, useState } from "react";
import { searchActions } from "../../../store/search";
import { defaultCardFilter, filterInventory } from "../../../domain/filters";
import { Box, BoxCard, areSame, getKey } from "../../../domain/inventory";

function addOrIncrememnt(cards: BoxCard[], card: BoxCard): BoxCard[] {
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
}

export const BoxPageContainer = () => {
  const { name } = useParams();

  const dispatch = useDispatch();
  const lastSavedBoxState = useSelector(selectors.box(name!));
  const allCardsBySet = useSelector(selectors.setsWithCards);

  const [oldBox, setOldBox] = useState(lastSavedBoxState);
  const [newBox, setNewBox] = useState(lastSavedBoxState);
  const [cardToEdit, setCardToEdit] = useState<BoxCard | null>(null);
  const [selectedKeys, setSelectedKeys] = useState<string[]>([]);
  const [filter, setFilter] = useState(defaultCardFilter);

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
    const cards = newBox.cards.filter((c) => !areSame(c, card));
    setNewBox({ ...newBox, cards });
    dispatch(editingActions.edit());
    const key = getKey(card);
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

  const cards = filterInventory(newBox ? [newBox] : [], filter, allCardsBySet, []);

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
