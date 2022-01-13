import * as React from "react";
import { CardName } from "../logic/model";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import Search from "./search";
import { orderBy } from "lodash";
import { currentSelectionActions } from "../store/currentSelection";

type Props = {
};

function searchCardNames(query: string, cardNames: CardName[]) : CardName[] {
    const q = query.toLowerCase();
    const matches = cardNames.filter(c => c.normalizedName.includes(q));
    const sorted = orderBy(matches, x => x.normalizedName);
    return sorted;
}

const CardSearch = (props: Props) => {
    const dispatch = useDispatch();

    const cardNames : CardName[] = useSelector(
        (state: RootState) => state.encyclopedia.cardNames
    );

    return (
        <Search
            items={cardNames}
            getLabel={card => card.name}
            search={searchCardNames}
            debounceMinLength={3}
            showEmptyIfNoQuery={true}
            placeholder="Enter card name..."
            disabled={false}
            onSuggestionClicked={card => {
                console.log(`You clicked ${card.name}`);
                dispatch(currentSelectionActions.selectCardName(card));
            }}
            onQueryChanged={() => {
                dispatch(currentSelectionActions.clear());
            }}
        />
    )
};
export default CardSearch;