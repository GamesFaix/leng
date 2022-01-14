import * as React from 'react';
import { NamedCard } from '../../../logic/model';
import { Card } from 'scryfall-api';
import SuggestionList from './suggestion-list';

type Props = {
    cardName: NamedCard | null,
    setAbbrev: string | null,
    onVersionPicked: (scryfallId: string, isFoil: boolean) => void,
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

const EnabledVersionPicker = (props: Props) => {
    const suggestions = props.cardName?.cards.filter(c => c.set === props.setAbbrev) ?? [];
    const [activeSuggestionIndex, setActiveSuggestionIndex] = React.useState(0);

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
                    props.onVersionPicked(activeSuggestion.id, activeSuggestion.foil);
                }
                break;
            default:
                return;
        }
    }

    return (
        <SuggestionList
            items={suggestions}
            activeIndex={activeSuggestionIndex}
            getItemLabel={getVersionLabel}
            onItemClicked={version => props.onVersionPicked(version.id, version.foil)}
        />
    )
};

const DisabledVersionPicker = () => {
    return (
        <div>

        </div>
    );
};

const VersionPicker = (props: Props) => {
    return (
        props.disabled
            ? <DisabledVersionPicker/>
            : EnabledVersionPicker(props)
    );
}
export default VersionPicker;