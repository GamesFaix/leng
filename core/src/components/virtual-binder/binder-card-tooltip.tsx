import { Typography } from "@mui/material";
import { orderBy } from "lodash";
import { CardFinish, Language } from "../../domain/encyclopedia";
import { BoxCard } from "../../domain/inventory";
import { FlagIcon } from "../common";
import { FC, Fragment } from "react";

type Props = {
  cardGroup: BoxCard[];
};

const getLanguageHint = (lang: Language) => {
  switch (lang) {
    case Language.ChineseSimplified:
      return "(Simp.)";
    case Language.ChineseTraditional:
      return "(Trad.)";
    default:
      return "";
  }
}

const getCardLabel = (card: BoxCard) => {
  const finish = card.finish === CardFinish.Normal ? "" : card.finish; // TODO: Capitalize
  const langHint = getLanguageHint(card.lang);

  return (
    <Fragment key={card.scryfallId}>
      <br />
      <span>
        {card.count} <FlagIcon lang={card.lang} /> {langHint} {finish}
      </span>
    </Fragment>
  );
}

const sortCardGroup = (cardGroup: BoxCard[]): BoxCard[] => {
  // English first, then alphabetical by language; foil after non-foil per language
  const englishCards = cardGroup.filter((c) => c.lang === Language.English);
  const nonEnglishCards = cardGroup.filter((c) => c.lang !== Language.English);

  const sortedEnglish = orderBy(englishCards, (c) => c.finish); // TODO: Sort so normal is first, not alphabetically
  const sortedNonEnglish = orderBy(nonEnglishCards, [
    (c) => c.lang,
    (c) => c.finish,
  ]);
  return sortedEnglish.concat(sortedNonEnglish);
}

export const BinderCardTooltip : FC<Props> = ({ cardGroup }) => {
  const aCard = cardGroup[0];
  const sortedCards = sortCardGroup(cardGroup);
  
  return (
    <Typography>
      {aCard.name}
      <br />
      {`${aCard.setName} (#${aCard.collectorsNumber})`}
      {sortedCards.map(getCardLabel)}
    </Typography>
  );
};
