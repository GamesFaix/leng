import { groupBy } from "lodash";
import { BoxCard } from "./model";

export type CsvCard = {
    count: number;
    name: string;
    setAbbrev: string;
    language: string | null;
    condition: string | null;
    foilCount: number | null;
    multiverseId: string | null;
}

function toCsvCard(group: BoxCard[]) : CsvCard {
    const { name, setAbbrev, lang } = group[0];
    const count = group.filter(c => !c.foil).map(c => c.count).reduce((a,b) => a+b, 0);
    const foilCount = group.filter(c => c.foil).map(c => c.count).reduce((a,b) => a+b, 0);
    return {
        count,
        name,
        setAbbrev,
        language: lang, // TODO: map to abbrev
        condition: null,
        foilCount,
        multiverseId: null
    };
}

export function toCsvCards(cards: BoxCard[]) : CsvCard[] {
    return Object.values(groupBy(cards, c => `${c.name}|${c.setAbbrev}|${c.lang}`))
        .map(toCsvCard);
}