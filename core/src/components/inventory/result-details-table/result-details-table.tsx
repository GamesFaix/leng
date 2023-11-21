import { Column, Table } from "react-virtualized";
import { FC, useMemo } from "react";
import { InventoryResult } from "../../../domain/inventory-search";
import { SetCell } from "./set-cell";
import { FinishCell } from "./finish-cell";
import { LanguageCell } from "./language-cell";
import { orderBy } from "lodash";
import { Language } from "../../../domain/encyclopedia";
import { BoxCard } from "../../../domain/inventory";

type Props = {
  result: InventoryResult;
};

const sortCards = (cards: BoxCard[]): BoxCard[] => {
  // English first, then alphabetical by language; foil after non-foil per language
  const englishCards = cards.filter((c) => c.lang === Language.English);
  const nonEnglishCards = cards.filter((c) => c.lang !== Language.English);

  const sortedEnglish = orderBy(englishCards, (c) => c.finish); // TODO: Sort so normal is first, not alphabetically
  const sortedNonEnglish = orderBy(nonEnglishCards, [
    (c) => c.lang,
    (c) => c.finish,
  ]);
  return sortedEnglish.concat(sortedNonEnglish);
};

export const ResultDetailsTable: FC<Props> = ({ result }) => {
  const cards = useMemo(() => sortCards(result.cards), [result]);

  return (
    <Table
      width={900}
      height={600}
      headerHeight={20}
      rowHeight={30}
      rowCount={cards.length}
      rowGetter={({ index }) => cards[index]}
    >
      <Column label="Ct." dataKey="count" width={50} />
      <Column
        width={200}
        label="Set"
        dataKey="setAbbrev"
        cellRenderer={(props) => <SetCell {...props} />}
      />
      <Column width={100} label="Version" dataKey="version" />
      <Column
        width={50}
        label="Finish"
        dataKey="finish"
        cellRenderer={(props) => <FinishCell {...props} />}
      />
      <Column
        width={100}
        label="Lang."
        dataKey="lang"
        cellRenderer={(props) => <LanguageCell {...props} />}
      />
    </Table>
  );
};
