import {
  MenuItem,
  Select,
  SelectChangeEvent,
  Table,
  TableBody,
  TableContainer,
} from "@mui/material";
import * as React from "react";
import { useSelector } from "react-redux";
import { selectors } from "../../../store";
import { Set, Card as ScryfallCard } from "../../../domain/encyclopedia";
import { getCardsFromBoxes } from "../../../domain/filters";
import { BoxCard } from "../../../domain/inventory";
import {
  CheckListVisibility,
  getRarity,
  ParentSetCompletionModel,
  Rarity,
  SetCompletionModel,
} from "./model";
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
          allCards: encyclopediaCardsBySet[set.code].filter(
            (c) =>
              // These are usually alternate Chinese arts
              !c.collector_number.endsWith("s") &&
              !c.collector_number.endsWith("†")
          ),
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

  const model = React.useMemo(() => {
    const codes = [
      props.parentSetCode,
      ...sets
        .filter((s) => s.parent_set_code === props.parentSetCode)
        .map((s) => s.code),
    ];
    const selectedCards = getCardsFromBoxes(boxes).filter((c) =>
      codes.includes(c.setAbbrev)
    );

    const selectedSetGroup = setGroupsInBoxes.find(
      (sg) => props.parentSetCode === sg.parent.code
    );
    const selectedSets = selectedSetGroup
      ? [selectedSetGroup.parent, ...selectedSetGroup.children]
      : [];

    return createModel(selectedSets, selectedCards, cardsBySet);
  }, [props.parentSetCode, setGroupsInBoxes, boxes, sets, cardsBySet]);

  const [visibility, setVisibility] = React.useState(CheckListVisibility.all);

  const onVisibilityChanged = React.useCallback(
    (e: SelectChangeEvent<string>) => {
      const value = e.target.value as CheckListVisibility;
      setVisibility(value);
    },
    [setVisibility]
  );

  return (
    <div>
      <Select value={visibility} onChange={onVisibilityChanged}>
        <MenuItem value={CheckListVisibility.all}>All</MenuItem>
        <MenuItem value={CheckListVisibility.owned}>Owned</MenuItem>
        <MenuItem value={CheckListVisibility.missing}>Missing</MenuItem>
      </Select>
      <TableContainer>
        <Table width="sm">
          <TableBody>
            <SetStatsRow
              label="Main Set"
              model={model.parentSet}
              visibility={visibility}
            />
            <SetStatsRow
              label="Special"
              model={ofRarity("special", model.parentSet)}
              visibility={visibility}
            />
            <SetStatsRow
              label="Mythics"
              model={ofRarity("mythic", model.parentSet)}
              visibility={visibility}
            />
            <SetStatsRow
              label="Rares"
              model={ofRarity("rare", model.parentSet)}
              visibility={visibility}
            />
            <SetStatsRow
              label="Uncommons"
              model={ofRarity("uncommon", model.parentSet)}
              visibility={visibility}
            />
            <SetStatsRow
              label="Commons"
              model={ofRarity("common", model.parentSet)}
              visibility={visibility}
            />
            <SetStatsRow
              label="Basic Lands"
              model={ofRarity("basicland", model.parentSet)}
              visibility={visibility}
            />
            <SetStatsRow
              label="Tokens"
              model={model.tokenSet}
              visibility={visibility}
            />
            <SetStatsRow
              label="Promo Cards"
              model={model.promoSet}
              visibility={visibility}
            />
            <SetStatsRow
              label="Commander Cards"
              model={model.commanderSet}
              visibility={visibility}
            />
            <SetStatsRow
              label="Masterpiece Cards"
              model={model.masterpieceSet}
              visibility={visibility}
            />
            <SetStatsRow
              label="Art Cards"
              model={model.artSet}
              visibility={visibility}
            />
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default SetStatsPanel;
