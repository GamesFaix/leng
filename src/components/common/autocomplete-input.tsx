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
    placeholder?: string,
    debounceMilliseconds?: number,
    query: string,
    setQuery: (query: string) => void
};

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
    const [suggestions, setSuggestions] = React.useState(getStartingSuggestions(props));
    const [activeIndex, setActiveIndex] = React.useState(getStartingIndex(props));

    const updateSuggestions = (newQuery: string) => {
        const newSuggestions = props.getSuggestions(props.items, newQuery);
        setSuggestions(newSuggestions);
        setActiveIndex(0);
    }

    const maybeDebounced_updateSuggestions =
        props.debounceMilliseconds
            ? debounce(updateSuggestions, props.debounceMilliseconds)
            : updateSuggestions;

    const updateSuggestionsCallback = React.useCallback(
        maybeDebounced_updateSuggestions,
        [setSuggestions, props]
    );

    React.useLayoutEffect(() => {
        if (props.defaultSuggestions === DefaultSuggestionMode.All &&
            props.items.length > 0 &&
            props.query === '') {

            maybeDebounced_updateSuggestions(props.query);
        }
    }, [setSuggestions, suggestions, props]);

    const isOnlyOneOption = props.items.length === 1;

    React.useEffect(() => {
        if (isOnlyOneOption &&
            props.selection === null) {
                onSelection(props.items[0]);
            }
    }, [setSuggestions, props])

    const onSelection = (item: T) => {
        props.setQuery(props.getItemLabel(item));
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
            case 'Tab':
                selectActiveItem();
                break;
            default:
                return;
        }
    }

    const onQueryChanged = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        props.setQuery(newQuery);

        if (props.minLength && newQuery.length < props.minLength) {
            setSuggestions([]);
        } else {
            updateSuggestionsCallback(newQuery);
        }
    }

    return (<div className="autocomplete-input">
        <input
            placeholder={props.placeholder}
            value={props.query}
            onChange={onQueryChanged}
            disabled={props.disabled || isOnlyOneOption}
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