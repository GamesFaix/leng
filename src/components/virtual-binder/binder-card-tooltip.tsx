import { Typography } from '@mui/material';
import { orderBy } from 'lodash';
import * as React from 'react';
import { BoxCard, Language } from '../../logic/model';
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
    const foil = card.foil ? ' Foil' : '';
    const langHint = getLanguageHint(card.lang);

    return <React.Fragment key={card.scryfallId}>
        <br/>
        <span>
            {card.count} <FlagIcon lang={card.lang}/> {langHint} {foil}
        </span>
    </React.Fragment>;
}

function sortCardGroup(cardGroup: BoxCard[]) : BoxCard[] {
    // English first, then alphabetical by language; foil after non-foil per language
    const englishCards = cardGroup.filter(c => c.lang === Language.English);
    const nonEnglishCards = cardGroup.filter(c => c.lang !== Language.English);

    const sortedEnglish = orderBy(englishCards, c => c.foil);
    const sortedNonEnglish = orderBy(nonEnglishCards, [c => c.lang, c => c.foil]);
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