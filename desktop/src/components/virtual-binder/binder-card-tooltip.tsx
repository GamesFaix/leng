import { Typography } from '@mui/material';
import { orderBy } from 'lodash';
import * as React from 'react';
import { BoxCard, CardFinish, Language } from "leng-core/src/logic/model";
import FlagIcon from '../common/flag-icon';

type Props = {
    cardGroup: BoxCard[]
}

function getLanguageHint(lang: Language) {
    switch (lang) {
        case Language.ChineseSimplified: return "(Simp.)";
        case Language.ChineseTraditional: return "(Trad.)";
        default: return "";
    }
}

function getCardLabel(card: BoxCard) {
    const finish = card.finish === CardFinish.Normal ? '' : card.finish; // TODO: Capitalize
    const langHint = getLanguageHint(card.lang);

    return <React.Fragment key={card.scryfallId}>
        <br/>
        <span>
            {card.count} <FlagIcon lang={card.lang}/> {langHint} {finish}
        </span>
    </React.Fragment>;
}

function sortCardGroup(cardGroup: BoxCard[]) : BoxCard[] {
    // English first, then alphabetical by language; foil after non-foil per language
    const englishCards = cardGroup.filter(c => c.lang === Language.English);
    const nonEnglishCards = cardGroup.filter(c => c.lang !== Language.English);

    const sortedEnglish = orderBy(englishCards, c => c.finish); // TODO: Sort so normal is first, not alphabetically
    const sortedNonEnglish = orderBy(nonEnglishCards, [c => c.lang, c => c.finish]);
    return sortedEnglish.concat(sortedNonEnglish);
}

const BinderCardTooltip = (props: Props) => {
    const aCard = props.cardGroup[0];
    const sortedCards = sortCardGroup(props.cardGroup);

    return (<Typography>
        {aCard.name}<br/>
        {`${aCard.setName} (#${aCard.collectorsNumber})`}
        {sortedCards.map(getCardLabel)}
    </Typography>);
}
export default BinderCardTooltip;