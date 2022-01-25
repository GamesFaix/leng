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
        return this.cards().find(c => c.id === scryfallId) || null;
    }
}