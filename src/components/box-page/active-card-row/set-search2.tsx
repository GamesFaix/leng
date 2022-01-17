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
    disabled: boolean
};

function searchSets(sets: SetInfo[], query: string) : SetInfo[] {
    const q = query.toLowerCase().trim();
    if (q === "") { return sets; }

    const matches = sets.filter(s => s.normalizedName.includes(q) || s.abbrev.includes(q));
    const sorted = orderBy(matches, x => x.name);
    return sorted;
}

const SetSearch2 = (props: Props) => {
    const allSets = useSelector((state: RootState) => state.encyclopedia.sets);
    const setsOfSelectedCard = props.selectedCard ? NamedCardModule.toSetInfos(props.selectedCard) : [];
    const selectedSet = props.selectedSetAbbrev ? allSets.find(s => s.abbrev === props.selectedSetAbbrev) ?? null : null;

    return (<AutocompleteInput
        items={setsOfSelectedCard}
        selection={selectedSet}
        getItemLabel={s => s.name}
        onSelection={s => props.onSetAbbrevSelected(s?.abbrev ?? null)}
        getSuggestions={searchSets}
        defaultSuggestions={DefaultSuggestionMode.All}
        placeholder="Enter set name..."
        disabled={props.disabled}
    />);
};
export default SetSearch2;
