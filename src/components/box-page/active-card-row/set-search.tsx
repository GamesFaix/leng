import * as React from "react";
import { orderBy } from "lodash";
import { NamedCard, NamedCardModule, SetInfo } from "../../../logic/model";
import AutocompleteInput, { DefaultSuggestionMode } from "../../common/autocomplete-input";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

type Props = {
    selectedCard: NamedCard | null,
    selectedSetAbbrev: string | null,
    onSetAbbrevSelected: (setAbbrev: string | null) => void,
    disabled: boolean,
    query: string,
    setQuery: (query: string) => void
};

function searchSets(sets: SetInfo[], query: string) : SetInfo[] {
    const q = query.toLowerCase().trim();
    if (q === "") { return sets; }

    const matches = sets.filter(s => s.normalizedName.includes(q) || s.abbrev.includes(q));
    const sorted = orderBy(matches, x => x.name);
    return sorted;
}

const SetSearch = (props: Props) => {
    const allSets = useSelector((state: RootState) => state.encyclopedia.sets);
    const setsOfSelectedCard = props.selectedCard ? NamedCardModule.toSetInfos(props.selectedCard) : [];
    const selectedSet = props.selectedSetAbbrev ? allSets.find(s => s.abbrev === props.selectedSetAbbrev) ?? null : null;

    return (<AutocompleteInput
        query={props.query}
        setQuery={props.setQuery}
        items={setsOfSelectedCard}
        selection={selectedSet}
        getItemLabel={s => s.name}
        onSelection={s => props.onSetAbbrevSelected(s?.abbrev ?? null)}
        getSuggestions={searchSets}
        defaultSuggestions={DefaultSuggestionMode.All}
        placeholder="Enter set name..."
        disabled={props.disabled}
        debounceMilliseconds={10}
    />);
};
export default SetSearch;
