import { Column, Table } from "react-virtualized";
import { FC, useMemo } from "react";
import { InventoryResult } from "../../../domain/inventory-search";
import { SetCell } from "./set-cell";
import { FinishCell } from "./finish-cell";
import { LanguageCell } from "./language-cell";
import { orderBy } from "lodash";
import { Language } from "../../../domain/encyclopedia";
import { BoxCard } from "../../../domain/inventory";
import { VersionCell } from "./version-cell";

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
      width={500}
      height={100}
      headerHeight={0}
      rowHeight={30}
      rowCount={cards.length}
      rowGetter={({ index }) => cards[index]}
    >
      <Column label="Ct." dataKey="count" width={10} />
      <Column
        width={150}
        label="Set"
        dataKey="setAbbrev"
        cellRenderer={(props) => <SetCell {...props} />}
      />
      <Column
        width={40}
        label="Version"
        dataKey="collectorsNumber"
        cellRenderer={(props) => <VersionCell {...props} />}
      />
      <Column
        width={20}
        label="Lang."
        dataKey="lang"
        cellRenderer={(props) => <LanguageCell {...props} />}
      />
      <Column
        width={35}
        label="Finish"
        dataKey="finish"
        cellRenderer={(props) => <FinishCell {...props} />}
      />
    </Table>
  );
};
