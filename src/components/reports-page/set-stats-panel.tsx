import {
  Table,
  TableBody,
  TableContainer,
} from "@mui/material";
import * as React from "react";
import { useSelector } from "react-redux";
import selectors from "../../store/selectors";
import { Set, Card as ScryfallCard } from "scryfall-api";
import { getCardsFromBoxes } from "../../logic/card-filters";
import { BoxCard } from "../../logic/model";
import { getRarity, ParentSetCompletionModel, Rarity, SetCompletionModel } from "./model";
import SetStatsRow from "./set-stats-row";

const ofRarity = (
  rarity: Rarity,
  model: SetCompletionModel
): SetCompletionModel => ({
  ...model,
  allCards: model.allCards.filter((c) => getRarity(c) === rarity),
});

const createModel = (
  selectedSets: Set[],
  ownedCards: BoxCard[],
  encyclopediaCardsBySet: Record<string, ScryfallCard[]>
): ParentSetCompletionModel => {
  const parentSet = selectedSets.find((s) => !s.parent_set_code)!;
  const tokenSet = selectedSets.find((s) => s.set_type === "token") ?? null;
  const masterpieceSet =
    selectedSets.find((s) => s.set_type === "masterpiece") ?? null;
  const promoSet = selectedSets.find((s) => s.set_type === "promo") ?? null;
  const commanderSet =
    selectedSets.find((s) => s.set_type === "commander") ?? null;
  // memorabilia also contains oversized cards and other things
  const artSet =
    selectedSets.find(
      (s) =>
        s.set_type === "memorabilia" && s.name.toLowerCase().includes("art")
    ) ?? null;

  const getSetModel = (set: Set | null) =>
    set
      ? {
          set,
          allCards: encyclopediaCardsBySet[set.code],
          ownedCards: ownedCards.filter((c) => c.setAbbrev === set.code),
        }
      : null;

  return {
    parentSet: getSetModel(parentSet)!,
    tokenSet: getSetModel(tokenSet),
    artSet: getSetModel(artSet),
    promoSet: getSetModel(promoSet),
    commanderSet: getSetModel(commanderSet),
    masterpieceSet: getSetModel(masterpieceSet),
  };
};

type Props = {
  parentSetCode: string | null;
};

const SetStatsPanel = (props: Props) => {
  const boxes = useSelector(selectors.boxes);
  const sets = useSelector(selectors.sets);
  const cardsBySet = useSelector(selectors.setsWithCards);
  const setGroupsInBoxes = useSelector(selectors.setGroupsInBoxes);

  const selectedCards = React.useMemo(() => {
    const codes = [
      props.parentSetCode,
      ...sets
        .filter((s) => s.parent_set_code === props.parentSetCode)
        .map((s) => s.code),
    ];
    return getCardsFromBoxes(boxes).filter((c) => codes.includes(c.setAbbrev));
  }, [props.parentSetCode, boxes, sets]);

  const selectedSets = React.useMemo(() => {
    const selectedSetGroup = setGroupsInBoxes.find(
      (sg) => props.parentSetCode === sg.parent.code
    );
    return selectedSetGroup
      ? [selectedSetGroup.parent, ...selectedSetGroup.children]
      : [];
  }, [props.parentSetCode, setGroupsInBoxes]);

  const model = React.useMemo(
    () => createModel(selectedSets, selectedCards, cardsBySet),
    [selectedSets, selectedCards, cardsBySet]
  );

  return (
    <TableContainer>
      <Table width="sm">
        <TableBody>
          <SetStatsRow label="Main Set" model={model.parentSet} />
          <SetStatsRow
            label="Mythics"
            model={ofRarity("mythic", model.parentSet)}
          />
          <SetStatsRow label="Rares" model={ofRarity("rare", model.parentSet)} />
          <SetStatsRow
            label="Uncommons"
            model={ofRarity("uncommon", model.parentSet)}
          />
          <SetStatsRow
            label="Commons"
            model={ofRarity("common", model.parentSet)}
          />
          <SetStatsRow
            label="Basic Lands"
            model={ofRarity("basicland", model.parentSet)}
          />
          <SetStatsRow label="Tokens" model={model.tokenSet} />
          <SetStatsRow label="Promo Cards" model={model.promoSet} />
          <SetStatsRow label="Commander Cards" model={model.commanderSet} />
          <SetStatsRow label="Masterpiece Cards" model={model.masterpieceSet} />
          <SetStatsRow label="Art Cards" model={model.artSet} />
        </TableBody>
      </Table>
    </TableContainer>
  );
};
export default SetStatsPanel;
