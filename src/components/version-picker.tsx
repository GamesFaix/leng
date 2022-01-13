import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CardName } from '../logic/model';
import { RootState } from '../store';
import { Card } from 'scryfall-api';
import SuggestionList from './suggestion-list';
import { currentSelectionActions } from '../store/currentSelection';
import { FrameEffect } from '../logic/bulk-data-controller';

type Props = {
    cardName: CardName,
    setAbbrev: string
}

type VersionModel = {
    scryfallId: string,
    collectorsNumber: string,
    frame: string,
    frameEffects: FrameEffect[],
    foil: boolean
}

function toVersionModels(cards: Card[]) : VersionModel[] {
    const models = cards
        .map(c => {
            const nonFoilVersion = {
                scryfallId: c.id,
                collectorsNumber: c.collector_number,
                frame: c.frame,
                frameEffects: c.frame_effects || [],
                foil: false
            };

            const foilVersion = {
                ...nonFoilVersion,
                foil: true
            };

            return c.foil
                ? [ nonFoilVersion, foilVersion ]
                : [ nonFoilVersion ];
        })
        .reduce((a, b) => a.concat(b));

    return models.sort(compareVersionModels);
}

function compareVersionModels(a: VersionModel, b: VersionModel) : number {
    if (a.collectorsNumber < b.collectorsNumber) return -1;
    if (a.collectorsNumber > b.collectorsNumber) return 1;
    if (!a.foil && b.foil) return -1;
    if (a.foil && !b.foil) return 1;
    return 0;
}

function getVersionLabel(version: VersionModel) : string {
    const numberStr = `#${version.collectorsNumber}`;
    const frameStr = `${version.frame}-frame`;
    const foilStr = version.foil ? " (Foil)" : "";

    let frameEffectsStr = "";
    if (version.frameEffects.includes("showcase")) {
        frameEffectsStr += " Showcase";
    }
    if (version.frameEffects.includes("extendedart")){
        frameEffectsStr += " Extended Art"
    }

    return `${numberStr} ${frameStr}${foilStr}${frameEffectsStr}`;
}

const EnabledVersionPicker = (props: Props) => {
    const cards = props.cardName.cards.filter(c => c.set === props.setAbbrev);
    const suggestions = toVersionModels(cards);
    const [activeSuggestionIndex, setActiveSuggestionIndex] = React.useState(0);
    const dispatch = useDispatch();

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
                    dispatch(currentSelectionActions.selectVersion(activeSuggestion.scryfallId, activeSuggestion.foil));
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
            onItemClicked={version => {
                dispatch(currentSelectionActions.selectVersion(version.scryfallId, version.foil))
            }}
        />
    )
};

const DisabledVersionPicker = () => {
    return (
        <div>

        </div>
    );
};

const VersionPicker = () => {
    const currentSelection = useSelector((state: RootState) => state.currentSelection);
    const isEnabled =
        currentSelection.cardName !== null &&
        currentSelection.setAbbrev !== null;

    return (
        isEnabled
            ? <EnabledVersionPicker
                cardName={currentSelection.cardName}
                setAbbrev={currentSelection.setAbbrev}
            />
            : <DisabledVersionPicker/>
    );
}
export default VersionPicker;