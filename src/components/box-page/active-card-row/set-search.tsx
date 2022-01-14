import * as React from "react";
import { orderBy, uniqBy } from "lodash";
import { DebounceInput } from "react-debounce-input";
import SuggestionList from "./suggestion-list";
import { NamedCard } from "../../../logic/model";

type Props = {
    selectedCard: NamedCard | null,
    onSetSelected: (setAbbrev:string) => void,
    disabled: boolean
};

type SetInfo = {
    name: string,
    normalizedName: string,
    abbrev: string
}

function searchSets(query: string, sets: SetInfo[]) : SetInfo[] {
    const q = query.toLowerCase().trim();
    if (q === "") { return sets; }

    const matches = sets.filter(s => s.normalizedName.includes(q) || s.abbrev.includes(q));
    const sorted = orderBy(matches, x => x);
    return sorted;
}

const SetSearchDisabled = () => {
    return (
        <div className="search">
            <DebounceInput
                className="search-input"
                minLength={0}
                debounceTimeout={300}
                placeholder="Enter set name..."
                disabled={true}
                onChange={() => { return; }}
            />
        </div>
    );
}

function getSetInfos(cardName: NamedCard): SetInfo [] {
    let sets = cardName.cards.map(c => [c.set, c.set_name]);
    sets = uniqBy(sets, tup => tup[0]);

    const setInfos = sets.map(s => {
        return {
            abbrev: s[0],
            name: s[1],
            normalizedName: s[1].toLowerCase()
        };
    });
    return orderBy(setInfos, "name");
}

const SetSearchEnabled = (props: Props) => {
    const allSuggestions = getSetInfos(props.selectedCard);
    const [suggestions, setSuggestions] = React.useState(allSuggestions); // Default to all suggestions if no query
    const [query, setQuery] = React.useState("");
    const [activeSuggestionIndex, setActiveSuggestionIndex] = React.useState(0);
    console.log(suggestions);

    const updateSuggestions = (items: SetInfo[]) => {
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

        const suggestions = q === ""
            ? allSuggestions
            : searchSets(q, allSuggestions);
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
                    props.onSetSelected(activeSuggestion.abbrev);
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
                minLength={0}
                debounceTimeout={300}
                onKeyDown={onKeyDown}
                value={query}
                placeholder="Enter set name..."
            />
            <SuggestionList
                items={suggestions}
                activeIndex={activeSuggestionIndex}
                getItemLabel={setInfo => setInfo.name}
                onItemClicked={setInfo => props.onSetSelected(setInfo.abbrev)}
            />
        </div>
    );
}

const SetSearch = (props: Props) => {
    return props.disabled
        ? <SetSearchDisabled/>
        : SetSearchEnabled(props);
};
export default SetSearch;
