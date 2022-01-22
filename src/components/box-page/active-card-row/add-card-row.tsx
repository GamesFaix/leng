import * as React from 'react';
import { icons } from '../../../fontawesome';
import { useStore } from '../../../hooks';
import { BoxCard, NamedCard } from '../../../logic/model';
import IconButton from '../../common/icon-button';
import CardSearch from './card-search';
import SetSearch from './set-search';
import VersionPicker, { getVersionLabel } from './version-picker';

type Props = {
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

const AddCardRow = (props: Props) => {
    const [cardNameQuery, setCardNameQuery] = React.useState('');
    const [setNameQuery, setSetNameQuery] = React.useState('');
    const [versionQuery, setVersionQuery] = React.useState('');
    const [selection, setCard] = React.useState<State>(defaultState);
    const namedCards : NamedCard[] = useStore.namedCards();

    const selectedNamedCard = namedCards.find(c => c.name === selection.name) ?? null;
    const selectedVersion = selectedNamedCard?.cards.find(c => c.id === selection.scryfallId) ?? null;

    const setSearchDisabled = selection.name === null;
    const versionPickerDisabled = setSearchDisabled || selection.setAbbrev === null;
    const submitDisabled = versionPickerDisabled || selectedVersion === null;
    const foilCheckboxDisabled = submitDisabled || !selectedVersion.foil || !selectedVersion.nonfoil;

    const setCount = (e: React.ChangeEvent<HTMLInputElement>) =>
        setCard({
            ...selection,
            count: Number(e.target.value)
        });

    const setCardName = (name: string | null) => {
        const newState : State = name === null
            ? defaultState
            : {
                ...selection,
                name,
                setAbbrev: null,
                scryfallId: null,
                foil: false
            };
        setCard(newState);
    };

    const setSetAbbrev = (setAbbrev: string | null) =>
        setCard({
            ...selection,
            setAbbrev,
            scryfallId: null,
            foil: false
        });

    const setVersion = (scryfallId: string) =>  {
        const pickedCard = selectedNamedCard?.cards.find(c => c.id === scryfallId) ?? null;

        const foil =
            (pickedCard && pickedCard.foil && !pickedCard.nonfoil) ? true :
            (pickedCard && !pickedCard.foil && pickedCard.nonfoil) ? false :
            selection.foil;

        setCard({
            ...selection,
            scryfallId,
            foil
        });
    };

    const setFoil = (e: React.ChangeEvent<HTMLInputElement>) =>
        setCard({
            ...selection,
            foil: e.target.checked
        });

    function clear() {
        setCard(defaultState);
        setCardNameQuery('');
        setSetNameQuery('');
        setVersionQuery('');
    }

    const submit = () => {
        const c = { ...selection };
        clear();
        props.onSubmit({
            name: c.name!,
            scryfallId: c.scryfallId!,
            setAbbrev: c.setAbbrev!,
            count: c.count,
            foil: c.foil,
            version: getVersionLabel(selectedVersion!)
        });
    };

    const cancel = () => {
        clear();
        props.onCancel();
    };

    return (<tr>
        <td>
            <input
                type="number"
                title="Count"
                min={1}
                max={1000}
                value={selection.count}
                onChange={setCount}
                autoFocus
                onFocus={e => e.target.select()}
            />
        </td>
        <td>
            <CardSearch
                onCardSelected={setCardName}
                selectedCardName={selection.name}
                query={cardNameQuery}
                setQuery={setCardNameQuery}
            />
        </td>
        <td>
            <SetSearch
                selectedCard={selectedNamedCard}
                onSetAbbrevSelected={setSetAbbrev}
                selectedSetAbbrev={selection.setAbbrev}
                disabled={setSearchDisabled}
                query={setNameQuery}
                setQuery={setSetNameQuery}
            />
        </td>
        <td>
            <VersionPicker
                namedCard={selectedNamedCard}
                setAbbrev={selection.setAbbrev}
                version={selectedVersion}
                onVersionPicked={setVersion}
                disabled={versionPickerDisabled}
                query={versionQuery}
                setQuery={setVersionQuery}
            />
        </td>
        <td>
            <input
                type="checkbox"
                title="Foil"
                checked={selection.foil}
                onChange={setFoil}
                disabled={foilCheckboxDisabled}
            />
        </td>
        <td>
            <IconButton
                title="Submit"
                disabled={submitDisabled}
                onClick={submit}
                icon={icons.ok}
            />
            <IconButton
                title="Cancel"
                onClick={cancel}
                icon={icons.cancel}
            />
        </td>
    </tr>);
}
export default AddCardRow;