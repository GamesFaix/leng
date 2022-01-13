import * as React from "react";
import { CardName } from "../logic/model";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { orderBy } from "lodash";
import { currentSelectionActions } from "../store/currentSelection";
import { DebounceInput } from "react-debounce-input";
import SuggestionList from "./suggestion-list";

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

    const [suggestions, setSuggestions] = React.useState([]);
    const [query, setQuery] = React.useState("");
    const [activeSuggestionIndex, setActiveSuggestionIndex] = React.useState(null);

    const updateSuggestions = (items: CardName[]) => {
        console.log(items);
        setSuggestions(items);
        if (items.length === 0) {
            setActiveSuggestionIndex(null);
        }
        else {
            setActiveSuggestionIndex(0);
        }
    }

    const updateQuery = (query: string) => {
        const q = query?.trim() || "";
        setQuery(q);
        dispatch(currentSelectionActions.clear());
        const suggestions = q === ""
            ? []
            : searchCardNames(q, cardNames);
        return updateSuggestions(suggestions);
    }

    const onKeyDown = (e: React.KeyboardEvent) => {
        switch(e.code) {
            case 'ArrowUp':
                if (suggestions.length > 0 && activeSuggestionIndex > 0) {
                    setActiveSuggestionIndex(activeSuggestionIndex - 1);
                }
                break;
            case 'ArrowDown':
                if (suggestions.length > 0 && activeSuggestionIndex < suggestions.length - 1){
                    setActiveSuggestionIndex(activeSuggestionIndex + 1);
                }
                break;
            case 'Enter':
                if (activeSuggestionIndex >= 0) {
                    const activeSuggestion = suggestions[activeSuggestionIndex];
                    dispatch(currentSelectionActions.selectCardName(activeSuggestion));
                }
                break;
            default:
                return;
        }
    }

    return (
        <div className="search">
            <DebounceInput
                className="search-input"
                onChange={e => updateQuery(e.target.value)}
                minLength={3}
                debounceTimeout={300}
                onKeyDown={onKeyDown}
                value={query}
                placeholder="Enter card name..."
            />
            <SuggestionList
                items={suggestions}
                activeIndex={activeSuggestionIndex}
                getItemLabel={cardName => cardName.name}
                onItemClicked={cardName => {
                    dispatch(currentSelectionActions.selectCardName(cardName));
                }}
            />
        </div>
    );
};
export default CardSearch;