import { useSelector } from "react-redux";
import { RootState } from "../store";

export const useStore = {
    cards() {
        return useSelector(
            (state: RootState) => state.encyclopedia.cards
        );
    },

    namedCards() {
        return useSelector(
            (state: RootState) => state.encyclopedia.namedCards
        );
    },

    sets() {
        return useSelector(
            (state: RootState) => state.encyclopedia.sets
        )
    }
}