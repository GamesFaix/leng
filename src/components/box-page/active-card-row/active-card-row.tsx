import * as React from 'react';
import { useSelector } from 'react-redux';
import { BoxCard, NamedCard } from '../../../logic/model';
import { RootState } from '../../../store';
import CardSearch from './card-search';
import SetSearch from './set-search';
import VersionPicker from './version-picker';

type Props = {
    card: BoxCard | null // null if creating, non-null if editing
}

type State = {
    name: string | null,
    setAbbrev: string | null,
    scryfallId: string | null,
    foil: boolean,
    count: number
}

const defaultState = {
    name: null,
    setAbbrev: null,
    scryfallId: null,
    foil: false,
    count: 1
};

function toState(card: BoxCard) : State {
    return {
        name: card.name,
        count: card.count,
        scryfallId: card.scryfallId,
        setAbbrev: card.setAbbrev,
        foil: card.foil
    };
}

const ActiveCardRow = (props: Props) => {
    const startingState = props.card === null ? defaultState : toState(props.card);
    const [card, setCard] = React.useState<State>(startingState);

    const namedCards : NamedCard[] = useSelector(
        (state: RootState) => state.encyclopedia.namedCards
    );

    const selectedNamedCard = namedCards.find(c => c.name === card.name) || null;
    const selectedVersion = selectedNamedCard?.cards.find(c => c.id === card.scryfallId) || null;

    const setSearchDisabled = card.name === null;
    const versionPickerDisabled = setSearchDisabled || card.setAbbrev === null;
    const foilCheckboxDisabled = versionPickerDisabled || selectedVersion === null ||
        !selectedVersion.foil || !selectedVersion.nonfoil;

    return (<tr>
        <td>
            <input
                type="number"
                title="Count"
                min={1}
                max={1000}
                value={card.count}
                onChange={e => {
                    setCard({
                        ...card,
                        count: Number(e.target.value)
                    });
                }}
            />
        </td>
        <td>
            <CardSearch
                encyclopediaCards={namedCards}
                onCardSelected={name => {
                    const newState = name === null
                        ? defaultState
                        : {
                            ...card,
                            name,
                            setAbbrev: null,
                            version: null,
                            foil: false
                        };
                    setCard(newState);
                }}
            />
        </td>
        <td>
            <SetSearch
                selectedCard={selectedNamedCard}
                onSetSelected={abbrev => {
                    setCard({
                        ...card,
                        setAbbrev: abbrev,
                        scryfallId: null,
                        foil: false
                    });
                }}
                disabled={setSearchDisabled}
            />
        </td>
        <td>
            <VersionPicker
                cardName={selectedNamedCard}
                setAbbrev={card.setAbbrev}
                onVersionPicked={(scryfallId) => {
                    const pickedCard = selectedNamedCard.cards.find(c => c.id === scryfallId);

                    const foil =
                        (pickedCard.foil && !pickedCard.nonfoil) ? true :
                        (!pickedCard.foil && pickedCard.nonfoil) ? false :
                        card.foil;

                    setCard({
                        ...card,
                        scryfallId,
                        foil
                    });
                }}
                disabled={versionPickerDisabled}
            />
        </td>
        <td>
            <input
                type="checkbox"
                title="Foil"
                checked={card.foil}
                onChange={e => {
                    setCard({
                        ...card,
                        foil: e.target.checked
                    });
                }}
                disabled={foilCheckboxDisabled}
            />
        </td>
        <td>
            (save)
            (cancel)
        </td>
    </tr>);
}
export default ActiveCardRow;