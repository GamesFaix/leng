import * as React from "react";
import { NamedCard } from "../../../logic/model";
import { orderBy } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";
import AutocompleteInput, { DefaultSuggestionMode } from "../../common/autocomplete-input";

type Props = {
    selectedCardName: string | null
    onCardSelected: (name: string | null) => void
};

function searchCards(namedCards: NamedCard[], query: string) : NamedCard[] {
    const q = query.toLowerCase();
    const matches = namedCards.filter(c => c.normalizedName.includes(q));
    const sorted = orderBy(matches, x => x.normalizedName);
    return sorted;
}

const CardSearch2 = (props: Props) => {
    const namedCards = useSelector((state: RootState) => state.encyclopedia.namedCards);
    const selection = props.selectedCardName ? namedCards.find(c => c.name === props.selectedCardName) ?? null : null;

    return (<AutocompleteInput
        items={namedCards}
        selection={selection}
        getItemLabel={c => c.name}
        onSelection={c => props.onCardSelected(c?.name ?? null)}
        getSuggestions={searchCards}
        defaultSuggestions={DefaultSuggestionMode.None}
        minLength={3}
    />);
};
export default CardSearch2;