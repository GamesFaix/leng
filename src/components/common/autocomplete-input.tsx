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
    minLength?: number,
    disabled?: boolean,
    placeholder?: string
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

    const updateSuggestions = (newQuery: string) => {
        const newSuggestions = props.getSuggestions(props.items, newQuery);
        setSuggestions(newSuggestions);
    }
    const debouncedUpdateSuggestions = React.useCallback(
        debounce(updateSuggestions, 200),
        [setSuggestions, props]
    );

    return (<div className="new-card-search">
        <input
            placeholder={props.placeholder}
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
            disabled={props.disabled}
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