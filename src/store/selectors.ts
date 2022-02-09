import { uniq } from "lodash";
import { RootState } from ".";

const selectors = {
    preload: (state: RootState) => state.preload,
    boxes: (state: RootState) => state.inventory.boxes ?? [],
    settings: (state: RootState) => state.settings.settings  ?? { dataPath: '' },
    cardIndex: (state: RootState) => state.encyclopedia.cardIndex,
    sets: (state: RootState) => state.encyclopedia.sets,
    setsOfCard(cardName: string | null) {
        return (state: RootState) => {
            const cards = state.encyclopedia.cards.filter(c => c.name === cardName);
            const sets = state.encyclopedia.setIndex;
            return uniq(cards.map(c => sets[c.set]));
        }
    },
    cardNames: (state: RootState) => state.encyclopedia.cardNames,
    cardsOfNameAndSetName(cardName: string | null, setName: string | null) {
        return (state: RootState) => {
            const cards = state.encyclopedia.cards.filter(c => c.name === cardName && c.set_name === setName);
            return cards;
        }
    },
    box(name: string | null) {
        return (state: RootState) => {
            return state.inventory.boxes?.find(b => b.name === name) ?? null;
        }
    },
    set(abbrev: string) {
        return (state: RootState) => {
            return state.encyclopedia.setIndex[abbrev] ?? null;
        }
    }
}
export default selectors;