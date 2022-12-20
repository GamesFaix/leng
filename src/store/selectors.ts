import { groupBy, orderBy, uniq } from "lodash";
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
    setsWithCards: (state: RootState) => {
        const allCards = state.encyclopedia.cards;
        const bySet = groupBy(allCards, c => c.set);
        return bySet;
    },
    setsGroupedByParent: (state: RootState) => {
        const { sets } = state.encyclopedia;
        const groupedByParent = groupBy(sets, s => s.parent_set_code);
        const parentSets = sets.filter(s => !s.parent_set_code);
        return parentSets.map(s => ({ parent: s, children: groupedByParent[s.code]}));
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
    unsavedChanges: (state: RootState) => state.editing.unsavedChanges,
    formats(state: RootState) {
        const anyCard = state.encyclopedia.cards[0];
        return Object.keys(anyCard.legalities);
    }
}
export default selectors;