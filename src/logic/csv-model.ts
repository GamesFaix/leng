import { groupBy } from "lodash";
import { BoxCard, CardFinish, Language } from "./model";

export type CsvCard = {
    count: number;
    name: string;
    setAbbrev: string;
    language: string | null;
    condition: string | null;
    foilCount: number | null;
    multiverseId: string | null;
}

function normalizeSetAbbrev(setAbbrev: string) : string {
    return setAbbrev.length === 4 ? setAbbrev.substring(1) : setAbbrev;
}

function normalizeLang(lang: Language) : string {
    switch (lang) {
        case Language.ChineseSimplified: return 'CN';
        case Language.ChineseTraditional: return 'CN';
        case Language.English: return 'EN';
        case Language.French: return 'FR';
        case Language.German: return 'GE';
        case Language.Italian: return 'IT';
        case Language.Japanese: return 'JP';
        case Language.Korean: return 'KO';
        case Language.Portuguese: return 'PR';
        case Language.Russian: return 'RS';
        case Language.Spanish: return 'SP';
        default: return '';
    }
}

function toCsvCard(group: BoxCard[]) : CsvCard {
    const { name, setAbbrev, lang } = group[0];
    const count = group.filter(c => c.finish === CardFinish.Normal).map(c => c.count).reduce((a,b) => a+b, 0);
    const foilCount = group.filter(c => c.finish !== CardFinish.Normal).map(c => c.count).reduce((a,b) => a+b, 0);
    return {
        count,
        name,
        setAbbrev: normalizeSetAbbrev(setAbbrev),
        language: normalizeLang(lang),
        condition: null,
        foilCount,
        multiverseId: null
    };
}

export function toCsvCards(cards: BoxCard[]) : CsvCard[] {
    const isToken = (c: BoxCard) => c.setAbbrev.length === 4 && c.setAbbrev.startsWith('t');
    const isArt = (c: BoxCard) => c.setAbbrev.length === 4 && c.setAbbrev.startsWith('a');
    const filteredCards = cards.filter(c => !isArt(c) && !isToken(c));
    return Object.values(groupBy(filteredCards, c => `${c.name}|${normalizeSetAbbrev(c.setAbbrev)}|${c.lang}`))
        .map(toCsvCard);
}