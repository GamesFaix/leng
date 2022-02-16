import { orderBy, uniq } from "lodash";
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
            let sets = cards.map(c => state.encyclopedia.setIndex[c.set]);
            sets = uniq(sets);
            return orderBy(sets, s => s.name);
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
    },
    card(scryfallId: string) {
        return (state: RootState) => {
            return state.encyclopedia.cardIndex[scryfallId] ?? null;
        }
    },
    isCardImageLoaded(scryfallId: string) {
        return (state: RootState) => {
            return state.encyclopedia.cachedCardImageIds.includes(scryfallId);
        }
    },
    unsavedChanges() {
        return (state: RootState) => {
            return state.editing.unsavedChanges;
        };
    }
}
export default selectors;