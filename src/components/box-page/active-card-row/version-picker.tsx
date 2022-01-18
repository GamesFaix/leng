import * as React from 'react';
import { NamedCard } from '../../../logic/model';
import { Card } from 'scryfall-api';
import AutocompleteInput, { DefaultSuggestionMode } from '../../common/autocomplete-input';

type Props = {
    namedCard: NamedCard | null,
    setAbbrev: string | null,
    version: Card | null,
    onVersionPicked: (scryfallId: string) => void,
    disabled: boolean
}

export function getVersionLabel(card: Card) : string {
    const numberStr = `#${card.collector_number}`;
    const frameStr = `${card.frame}-frame`;

    let frameEffectsStr = "";
    if (card.frame_effects?.includes("showcase")) {
        frameEffectsStr += " Showcase";
    }
    if (card.frame_effects?.includes("extendedart")){
        frameEffectsStr += " Extended Art"
    }

    return `${numberStr} ${frameStr}${frameEffectsStr}`;
}

function getSuggestions(cards: Card[], query: string) : Card[] {
    return cards;
}

const VersionPicker = (props: Props) => {
    const suggestions = props.namedCard?.cards.filter(c => c.set === props.setAbbrev) ?? [];

    return (<AutocompleteInput
        items={suggestions}
        selection={props.version}
        getItemLabel={getVersionLabel}
        onSelection={c => {
            if (c) {
                props.onVersionPicked(c.id);
            }
        }}
        getSuggestions={getSuggestions}
        defaultSuggestions={DefaultSuggestionMode.All}
        placeholder="Select version..."
        disabled={props.disabled}
    />);
}
export default VersionPicker;