import * as React from "react";
import { CardName } from "../logic/model";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { CurrentSelectionActionTypes } from "../store/currentSelection";
import Search from "./search";
import { orderBy } from "lodash";

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
            onSuggestionClicked={card => {
                console.log(`You clicked ${card.name}`);

                dispatch({
                    type: CurrentSelectionActionTypes.SelectCardName,
                    card: card
                });
            }}
        />
    )
};
export default CardSearch;