import { RootState } from ".";
import { CardModule } from "../logic/model";

const selectors = {
    preload: (state: RootState) => state.preload,
    boxes: (state: RootState) => state.inventory.boxes ?? [],
    settings: (state: RootState) => state.settings.settings  ?? { dataPath: '' },
    cardIndex: (state: RootState) => state.encyclopedia.cardIndex,
    sets: (state: RootState) => state.encyclopedia.sets,
    setsOfCard(cardName: string | null) {
        return (state: RootState) => {
            const cards = state.encyclopedia.cards.filter(c => c.name === cardName);
            const sets = CardModule.toSetInfos(cards);
            return sets;
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
    }
}
export default selectors;