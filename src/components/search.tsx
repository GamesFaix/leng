import * as React from "react";
import { DebounceInput } from "react-debounce-input";
import Suggestion from "./suggestion";

type Props<T> = {
    items: T[],
    getLabel: (item: T) => string,
    search: (query: string, items:T[]) => T[],
    onSuggestionClicked: (item: T) => void
};

function Search<T> (props: Props<T>) {
    const [suggestions, setSuggestions] = React.useState([]);
    const [query, setQuery] = React.useState('');
    const [activeSuggestionIndex, setActiveSuggestionIndex] = React.useState(null);

    const updateSuggestions = (items) => {
        console.log(items);
        setSuggestions(items);
        if (items.length === 0) {
            setActiveSuggestionIndex(null);
        }
        else {
            setActiveSuggestionIndex(0);
        }
    }

    const updateQuery = (query) => {
        const q = query?.trim() || "";
        setQuery(q);
        const cards = q === "" ? [] : props.search(q, props.items);
        return updateSuggestions(cards);
    }

    const onSuggestionClicked : (item: T) => Promise<void> = async item => {
        console.log(`You clicked ${props.getLabel(item)}`);
        props.onSuggestionClicked(item);
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
                    onSuggestionClicked(suggestions[activeSuggestionIndex]);
                    updateQuery('');
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
            />
            <div className="search-result-list">
                {suggestions.map((item, i) => (
                    <Suggestion
                        key={i.toString()}
                        item={item}
                        label={props.getLabel(item)}
                        onClick={onSuggestionClicked}
                        isActive={activeSuggestionIndex === i}
                    />
                ))}
            </div>
        </div>
    );
};
export default Search;