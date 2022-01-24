import { uniq } from "lodash";
import { useSelector } from "react-redux";
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

    setNamesOfCardName(cardName: string) {
        const cards = this.cards().filter(c => c.name === cardName);
        return uniq(cards.map(c => c.set_name)).sort();
    },

    cardsOfNameAndSetName(cardName: string, setName: string) {
        const cards = this.cards().filter(c => c.name === cardName && c.set_name === setName);
        return cards;
    }
}