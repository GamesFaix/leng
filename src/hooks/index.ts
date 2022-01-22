import { useSelector } from "react-redux";
import { RootState } from "../store";

export const useStore = {
    namedCards() {
        return useSelector(
            (state: RootState) => state.encyclopedia.namedCards
        );
    }
}