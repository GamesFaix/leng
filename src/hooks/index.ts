import { useSelector } from "react-redux";
import { CardModule } from "../logic/model";
import { RootState } from "../store";

export const useStore = {
    cards() {
        return useSelector(
            (state: RootState) => state.encyclopedia.cards
        );
    },

    sets() {
        return useSelector(
            (state: RootState) => state.encyclopedia.sets
        )
    },

    cardNames() {
        return useSelector((state: RootState) => state.encyclopedia.cardNames);
    },

    setsOfCard(cardName: string) {
        const cards = this.cards().filter(c => c.name === cardName);
        const sets = CardModule.toSetInfos(cards);
        return sets;
    },

    cardsOfNameAndSetName(cardName: string, setName: string) {
        const cards = this.cards().filter(c => c.name === cardName && c.set_name === setName);
        return cards;
    },

    cardById(scryfallId: string) {
        return useSelector(
            (state:RootState) => state.encyclopedia.cardIndex[scryfallId] ?? null
        )
    },

    settings() {
        return useSelector(
            (state: RootState) => state.settings.settings
        );
    },

    box(name: string | null) {
        return useSelector(
            (state: RootState) => state.inventory.boxes?.find(b => b.name === name) ?? null
        );
    },

    boxes() {
        return useSelector(
            (state: RootState) => state.inventory.boxes ?? []
        );
    }
}