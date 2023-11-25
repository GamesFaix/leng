import { TableCellProps } from "react-virtualized";
import { FC } from "react";
import { FlagIcon } from "../../common";
import { Language } from "../../../domain/encyclopedia";

const getHint = (lang: Language) => {
  switch (lang) {
    case Language.ChineseSimplified:
      return "(Simp.)";
    case Language.ChineseTraditional:
      return "(Trad.)";
    default:
      return "";
  }
};

export const LanguageCell: FC<TableCellProps> = ({ cellData }) => {
  const lang: Language = cellData;

  return (
    <span>
      <FlagIcon lang={lang} /> {getHint(lang)}
    </span>
  );
};
