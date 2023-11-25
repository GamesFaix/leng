import { Column, Table } from "react-virtualized";
import { FC, useMemo } from "react";
import { InventoryResult } from "../../../domain/inventory-search";
import { SetCell } from "./set-cell";
import { FinishCell } from "./finish-cell";
import { LanguageCell } from "./language-cell";
import { sortBy } from "lodash";
import { Language, Set, CardFinish } from "../../../domain/encyclopedia";
import { BoxCard } from "../../../domain/inventory";
import { VersionCell } from "./version-cell";
import { useSelector } from "react-redux";
import { selectors } from "../../../store";
import { CountCell } from "./count-cell";

type Props = {
  result: InventoryResult;
};

const getLangPriority = (lang: Language) => (lang === Language.English ? 1 : 2);

const getFinishPriority = (finish: CardFinish) => {
  switch (finish) {
    case CardFinish.Normal:
      return 1;
    case CardFinish.Foil:
      return 2;
    case CardFinish.Glossy:
      return 3;
    case CardFinish.Etched:
      return 4;
    default:
      return 5;
  }
};

const sortCards = (cards: BoxCard[], sets: Set[]): BoxCard[] => {
  const cardsWithSets: [BoxCard, Set][] = cards.map((c) => [
    c,
    sets.find((s) => s.code === c.setAbbrev)!,
  ]);

  return sortBy(
    cardsWithSets,
    (x) => x[1].released_at,
    (x) => x[0].collectorsNumber,
    (x) => getFinishPriority(x[0].finish),
    (x) => getLangPriority(x[0].lang),
    (x) => x[0].lang
  ).map((x) => x[0]);
};

export const ResultDetailsTable: FC<Props> = ({ result }) => {
  const sets = useSelector(selectors.sets);
  const cards = useMemo(() => sortCards(result.cards, sets), [result, sets]);

  return (
    <Table
      width={305}
      height={300}
      headerHeight={0}
      rowHeight={30}
      rowCount={cards.length}
      rowGetter={({ index }) => cards[index]}
    >
      <Column
        label="Ct."
        dataKey="count"
        width={30}
        cellRenderer={(props) => <CountCell {...props} />}
      />
      <Column
        width={150}
        label="Set"
        dataKey="setAbbrev"
        cellRenderer={(props) => <SetCell {...props} />}
      />
      <Column
        width={50}
        label="Version"
        dataKey="collectorsNumber"
        cellRenderer={(props) => <VersionCell {...props} />}
      />
      <Column
        width={30}
        label="Lang."
        dataKey="lang"
        cellRenderer={(props) => <LanguageCell {...props} />}
      />
      <Column
        width={45}
        label="Finish"
        dataKey="finish"
        cellRenderer={(props) => <FinishCell {...props} />}
      />
    </Table>
  );
};
