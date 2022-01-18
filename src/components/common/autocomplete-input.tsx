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

function getStartingIndex<T>(props: Props<T>) {
    return props.selection
        ? props.items.indexOf(props.selection)
        : 0;
}

function AutocompleteInput<T>(props: Props<T>) {
    const [query, setQuery] = React.useState(getStartingQuery(props));
    const [suggestions, setSuggestions] = React.useState(getStartingSuggestions(props));
    const [activeIndex, setActiveIndex] = React.useState(getStartingIndex(props));

    const updateSuggestions = (newQuery: string) => {
        const newSuggestions = props.getSuggestions(props.items, newQuery);
        setSuggestions(newSuggestions);
        setActiveIndex(0);
    }
    const debouncedUpdateSuggestions = React.useCallback(
        debounce(updateSuggestions, 200),
        [setSuggestions, props]
    );

    const onSelection = (item: T) => {
        setQuery(props.getItemLabel(item));
        setSuggestions([]);
        props.onSelection(item);
    }

    const moveActiveIndexUp = () => {
        if (activeIndex > 0) {
            setActiveIndex(activeIndex - 1);
        }
    }

    const moveActiveIndexDown = () => {
        if (suggestions.length > 0 &&
            activeIndex < suggestions.length - 1){
            setActiveIndex(activeIndex + 1);
        }
    }

    const selectActiveItem = () => {
        if (suggestions.length > 0) {
            onSelection(suggestions[activeIndex]);
        }
    }

    const onKeyDown = (e: React.KeyboardEvent) => {
        switch(e.code) {
            case 'ArrowUp':
                moveActiveIndexUp();
                break;
            case 'ArrowDown':
                moveActiveIndexDown();
                break;
            case 'Enter':
                selectActiveItem();
                break;
            default:
                return;
        }
    }

    const onQueryChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);

        if (props.minLength && query.length < props.minLength) {
            setSuggestions([]);
        } else {
            debouncedUpdateSuggestions(newQuery);
        }
    }

    return (<div className="autocomplete-input">
        <input
            placeholder={props.placeholder}
            value={query}
            onChange={onQueryChanged}
            disabled={props.disabled}
            onKeyDown={onKeyDown}
        />
        <div className="suggestion-container">
            <ul>
                {suggestions.map((item, index) => {
                    const label = props.getItemLabel(item);
                    return (
                        <li
                            key={label}
                            onClick={_ => onSelection(item)}
                            className={activeIndex === index ? "active" : ""}
                            onMouseOver={_ => setActiveIndex(index)}
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