import * as React from 'react';
import { icons } from '../../../fontawesome';
import { useStore } from '../../../hooks';
import { BoxCard } from '../../../logic/model';
import IconButton from '../../common/icon-button';
import CardSearch from './card-search';
import SetSearch from './set-search';
import VersionPicker, { getVersionLabel } from './version-picker';

type Props = {
    card: BoxCard,
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

const EditCardRow = (props: Props) => {
    const selectedCard = useStore.cards().find(c => c.id === props.card.scryfallId) ?? null;
    const selectedNamedCard = useStore.namedCards().find(c => c.name === props.card.name) ?? null;
    const [cardNameQuery, setCardNameQuery] = React.useState(selectedCard?.name ?? '');
    const [setNameQuery, setSetNameQuery] = React.useState(selectedCard?.set_name ?? '');
    const [versionQuery, setVersionQuery] = React.useState(selectedCard ? getVersionLabel(selectedCard) : '');
    const [selection, setCard] = React.useState<State>({ ...props.card });

    const setSearchDisabled = selection.name === null;
    const versionPickerDisabled = setSearchDisabled || selection.setAbbrev === null;
    const submitDisabled = versionPickerDisabled || selectedCard === null;
    const foilCheckboxDisabled = submitDisabled || !selectedCard.foil || !selectedCard.nonfoil;

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
        setCardNameQuery(name ?? '');
        setSetNameQuery('');
        setVersionQuery('');
    };

    const setSetAbbrev = (setAbbrev: string | null) => {
        setCard({
            ...selection,
            setAbbrev,
            scryfallId: null,
            foil: false
        });
        setSetNameQuery(setAbbrev ?? '');
        setVersionQuery('');
    }

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
            version: getVersionLabel(selectedCard!)
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
                version={selectedCard}
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
                variant="contained"
                color="success"
            />
            <IconButton
                title="Cancel"
                onClick={cancel}
                icon={icons.cancel}
                variant="outlined"
                color="error"
            />
        </td>
    </tr>);
}
export default EditCardRow;