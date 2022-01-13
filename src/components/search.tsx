import * as React from "react";
import { DebounceInput } from "react-debounce-input";
import Suggestion from "./suggestion";

type Props<T> = {
    items: T[],
    getLabel: (item: T) => string,
    search: (query: string, items:T[]) => T[],
    onQueryChanged: () => void,
    onSuggestionClicked: (item: T) => void,
    debounceMinLength: number,
    showEmptyIfNoQuery: boolean,
    placeholder: string,
    disabled: boolean
};

function Search<T> (props: Props<T>) {
    const [suggestions, setSuggestions] = React.useState([]);
    const [query, setQuery] = React.useState("");
    const [activeSuggestionIndex, setActiveSuggestionIndex] = React.useState(null);

    const updateSuggestions = (items: T[]) => {
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
        props.onQueryChanged();
        const suggestions = q === ""
            ? (props.showEmptyIfNoQuery ? [] : props.items)
            : props.search(q, props.items);
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
                    props.onSuggestionClicked(suggestions[activeSuggestionIndex]);
                }
                break;
            default:
                return;
        }
    }

    const suggestionsElements = props.disabled
        ? ""
        : suggestions.map((item, i) => (
            <Suggestion
                key={i.toString()}
                item={item}
                label={props.getLabel(item)}
                onClick={props.onSuggestionClicked}
                isActive={activeSuggestionIndex === i}
            />));

    return (
        <div className="search">
            <DebounceInput
                className="search-input"
                onChange={e => updateQuery(e.target.value)}
                minLength={props.debounceMinLength}
                debounceTimeout={300}
                onKeyDown={onKeyDown}
                value={query}
                placeholder={props.placeholder}
                disabled={props.disabled}
            />
            <div className="search-result-list">
                {suggestionsElements}
            </div>
        </div>
    );
};
export default Search;