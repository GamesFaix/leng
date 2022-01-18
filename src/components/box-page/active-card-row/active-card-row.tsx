import * as React from 'react';
import { useSelector } from 'react-redux';
import { icons } from '../../../fontawesome';
import { BoxCard, NamedCard } from '../../../logic/model';
import { RootState } from '../../../store';
import IconButton from '../../common/icon-button';
import CardSearch from './card-search';
import SetSearch from './set-search';
import VersionPicker, { getVersionLabel } from './version-picker';

type Props = {
    card: BoxCard | null // null if creating, non-null if editing
    onSubmit: (card: BoxCard) => void,
    onCancel: () => void
}

type State = {
    name: string | null,
    setAbbrev: string | null,
    scryfallId: string | null,
    foil: boolean,
    count: number
}

const defaultState : State = {
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
    const submitDisabled = versionPickerDisabled || selectedVersion === null;
    const foilCheckboxDisabled = submitDisabled || !selectedVersion.foil || !selectedVersion.nonfoil;

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
                autoFocus
                onFocus={e => e.target.select()}
            />
        </td>
        <td>
            <CardSearch
                onCardSelected={name => {
                    const newState : State = name === null
                        ? defaultState
                        : {
                            ...card,
                            name,
                            setAbbrev: null,
                            scryfallId: null,
                            foil: false
                        };
                    setCard(newState);
                }}
                selectedCardName={props.card?.name ?? null}
            />
        </td>
        <td>
            <SetSearch
                selectedCard={selectedNamedCard}
                onSetAbbrevSelected={setAbbrev => {
                    setCard({
                        ...card,
                        setAbbrev,
                        scryfallId: null,
                        foil: false
                    });
                }}
                selectedSetAbbrev={card.setAbbrev}
                disabled={setSearchDisabled}
            />
        </td>
        <td>
            <VersionPicker
                namedCard={selectedNamedCard}
                setAbbrev={card.setAbbrev}
                version={selectedVersion}
                onVersionPicked={(scryfallId: string) => {
                    const pickedCard = selectedNamedCard?.cards.find(c => c.id === scryfallId) ?? null;

                    const foil =
                        (pickedCard && pickedCard.foil && !pickedCard.nonfoil) ? true :
                        (pickedCard && !pickedCard.foil && pickedCard.nonfoil) ? false :
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
            <IconButton
                title="Submit"
                disabled={submitDisabled}
                onClick={() => {
                    props.onSubmit({
                        name: card.name!,
                        scryfallId: card.scryfallId!,
                        setAbbrev: card.setAbbrev!,
                        count: card.count,
                        foil: card.foil,
                        version: getVersionLabel(selectedVersion!)
                    });

                    // If add row, clear; if edit, don't
                    if (!props.card) {
                        setCard(startingState);
                    }
                }}
                icon={icons.ok}
            />
            <IconButton
                title="Cancel"
                onClick={() => {
                    props.onCancel();
                    setCard(startingState);
                }}
                icon={icons.cancel}
            />
        </td>
    </tr>);
}
export default ActiveCardRow;