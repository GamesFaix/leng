import { groupBy } from "lodash";
import { BoxCard, Language } from "./model";

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
        case Language.ChineseSimplified: return 'CS';
        case Language.ChineseTraditional: return 'CT';
        case Language.English: return 'EN';
        case Language.French: return 'FR';
        case Language.German: return 'DE';
        case Language.Italian: return 'IT';
        case Language.Japanese: return 'JP';
        case Language.Korean: return 'KR';
        case Language.Portuguese: return 'PT';
        case Language.Russian: return 'RU';
        case Language.Spanish: return 'ES';
        default: return '';
    }
}

function toCsvCard(group: BoxCard[]) : CsvCard {
    const { name, setAbbrev, lang } = group[0];
    const count = group.filter(c => !c.foil).map(c => c.count).reduce((a,b) => a+b, 0);
    const foilCount = group.filter(c => c.foil).map(c => c.count).reduce((a,b) => a+b, 0);
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
    return Object.values(groupBy(cards, c => `${c.name}|${normalizeSetAbbrev(c.setAbbrev)}|${c.lang}`))
        .map(toCsvCard);
}