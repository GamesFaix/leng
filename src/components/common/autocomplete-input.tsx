import * as React from "react";
import { debounce } from "lodash";

export enum DefaultSuggestionMode {
    All = "ALL",
    None = "NONE"
}

type Props<T> = {
    items: T[],
    selection: T | null,
    getItemLabel: (item: T) => string,
    onSelection: (item: T | null) => void,
    getSuggestions: (items: T[], query: string) => T[],
    defaultSuggestions?: DefaultSuggestionMode,
    minLength?: number
};

function getStartingQuery<T>(props: Props<T>) {
    return props.selection ? props.getItemLabel(props.selection) : '';
}

function getStartingSuggestions<T>(props: Props<T>) {
    switch (props.defaultSuggestions) {
        case DefaultSuggestionMode.All:
            return props.items;
        case DefaultSuggestionMode.None:
        default:
            return [];
    }
}

function AutocompleteInput<T>(props: Props<T>) {
    const [query, setQuery] = React.useState(getStartingQuery(props));
    const [suggestions, setSuggestions] = React.useState(getStartingSuggestions(props));

    const updateSuggestions = (newQuery: string) => setSuggestions(props.getSuggestions(props.items, newQuery));
    const debouncedUpdateSuggestions = React.useCallback(debounce(updateSuggestions, 200), []);

    return (<div className="new-card-search">
        <input
            placeholder="Enter card name..."
            value={query}
            onChange={e => {
                const newQuery = e.target.value;
                setQuery(newQuery);

                if (props.minLength && query.length < props.minLength) {
                    setSuggestions([]);
                } else {
                    debouncedUpdateSuggestions(newQuery);
                }
            }}
        />
        <div className="suggestion-container">
            <ul>
                {suggestions.map(item => {
                    const label = props.getItemLabel(item);
                    return (
                        <li
                            key={label}
                            onClick={() => {
                                setQuery(label);
                                setSuggestions([]);
                                props.onSelection(item);
                            }}
                        >
                            {label}
                        </li>
                    );
                })}
            </ul>
        </div>
    </div>);
};
export default AutocompleteInput;