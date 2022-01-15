import * as React from "react";
import { NamedCard, normalizeName } from "../../../logic/model";
import { orderBy } from "lodash";
import { DebounceInput } from "react-debounce-input";
import SuggestionList from "./suggestion-list";

type Props = {
    initialQuery: string | null,
    encyclopediaCards: NamedCard[],
    onCardSelected: (name: string | null) => void
};

function searchCardNames(query: string, cardNames: NamedCard[]) : NamedCard[] {
    const q = query.toLowerCase();
    const matches = cardNames.filter(c => c.normalizedName.includes(q));
    const sorted = orderBy(matches, x => x.normalizedName);
    return sorted;
}

const CardSearch = (props: Props) => {
    const [suggestions, setSuggestions] = React.useState<NamedCard[]>([]);
    const [query, setQuery] = React.useState(props.initialQuery ?? "");
    const [activeSuggestionIndex, setActiveSuggestionIndex] = React.useState<number | null>(null);

    const updateSuggestions = (items: NamedCard[]) => {
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
        let q = query?.trim() || "";
        q = normalizeName(q);
        setQuery(q);
        props.onCardSelected(null);
        const suggestions = q === ""
            ? []
            : searchCardNames(q, props.encyclopediaCards);
        return updateSuggestions(suggestions);
    }

    const onKeyDown = (e: React.KeyboardEvent) => {
        switch(e.code) {
            case 'ArrowUp':
                if (suggestions.length > 0 &&
                    activeSuggestionIndex !== null &&
                    activeSuggestionIndex > 0) {
                    setActiveSuggestionIndex(activeSuggestionIndex - 1);
                }
                break;
            case 'ArrowDown':
                if (suggestions.length > 0 &&
                    activeSuggestionIndex !== null &&
                    activeSuggestionIndex < suggestions.length - 1){
                    setActiveSuggestionIndex(activeSuggestionIndex + 1);
                }
                break;
            case 'Enter':
                if (activeSuggestionIndex !== null &&
                    activeSuggestionIndex >= 0) {
                    const activeSuggestion = suggestions[activeSuggestionIndex];
                    props.onCardSelected(activeSuggestion.name);
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
                getItemLabel={card => card.name}
                onItemClicked={card => props.onCardSelected(card.name)}
            />
        </div>
    );
};
export default CardSearch;