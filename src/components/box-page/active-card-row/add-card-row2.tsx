import * as React from 'react';
import { icons } from '../../../fontawesome';
import { useStore } from '../../../hooks';
import { BoxCard, normalizeName } from '../../../logic/model';
import IconButton from '../../common/icon-button';
import { Autocomplete, TextField } from '@mui/material';
import { Card } from 'scryfall-api';

type Props = {
    onSubmit: (card: BoxCard) => void,
    onCancel: () => void
}

type State = {
    cardNameQuery: string,
    cardName: string | null,
    setName: string | null,
    scryfallId: string | null,
    foil: boolean,
    count: number
}

const defaultState : State = {
    cardNameQuery: '',
    cardName: null,
    setName: null,
    scryfallId: null,
    foil: false,
    count: 1
};

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

const AddCardRow = (props: Props) => {
    const [state, setState] = React.useState(defaultState);
    const allCardNames = useStore.cardNames();
    const [cardNameOptions, setCardNameOptions] = React.useState<string[]>([]);
    const setNameOptions = useStore.setNamesOfCardName(state.cardName ?? '');
    const cardVersionOptions = useStore.cardsOfNameAndSetName(state.cardName ?? '', state.setName ?? '')
        .map(c => { return { ...c, label: getVersionLabel(c) }});
    const selectedCard = cardVersionOptions.find(c => c.id === state.scryfallId) ?? null;

    React.useEffect(() => {
        if (setNameOptions.length === 1 && !state.setName) {
            setSetName(setNameOptions[0]);
        }
        else if (cardVersionOptions.length === 1 && !state.scryfallId) {
            setScryfallId(cardVersionOptions[0].id);
        }
    })

    const isFoilCheckboxDisabled = false;
    const isSubmitButtonDisabled = false;
    const isCancelButtonDisabled = false;

    const setCount = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            count: Number(e.target.value)
        });
    };

    const updateCardNameQuery = (query: string) => {
        setState({
            ...state,
            cardNameQuery: query
        });

        const cardNameOptions =
            query.length < 3
                ? []
                : allCardNames.filter(x => normalizeName(x).includes(query.toLowerCase()));

        setCardNameOptions(cardNameOptions);
    };

    const setCardName = (name: string | null) => {
        setState({
            ...state,
            cardName: name,
            setName: null,
            scryfallId: null,
            foil: false,
        });
    };

    const setSetName = (name: string | null) => {
        setState({
            ...state,
            setName: name,
            scryfallId: null,
            foil: false,
        });
    };

    const setScryfallId = (id: string | null) => {
        setState({
            ...state,
            scryfallId: id,
            foil: false,
        });
    };

    const setFoil = (e: React.ChangeEvent<HTMLInputElement>) => {
        setState({
            ...state,
            foil: e.target.checked
        });
    };

    const submit = () => {
        throw "Not implemented"
    };

    const cancel = () => {
        throw "Not implemented"
    };

    return (<tr>
        <td>
            <input
                type="number"
                title="Count"
                min={1}
                max={1000}
                value={state.count}
                onChange={setCount}
                autoFocus
                onFocus={e => e.target.select()}
            />
        </td>
        <td>
            <Autocomplete
                options={cardNameOptions}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Card" />}
                onChange={(e, value, reason) => setCardName(value)}
                value={state.cardName}
                autoSelect
                autoHighlight
                inputValue={state.cardNameQuery}
                onInputChange={(e, value, reason) => updateCardNameQuery(value)}
                noOptionsText="Type at least 3 characters to search cards..."
            />
        </td>
        <td>
            <Autocomplete
                options={setNameOptions}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Set" />}
                onChange={(e, value, reason) => setSetName(value)}
                disabled={setNameOptions.length < 2}
                value={state.setName}
                autoSelect
                autoHighlight
            />
        </td>
        <td>
            <Autocomplete
                options={cardVersionOptions}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Version" />}
                onChange={(e, card, reason) => setScryfallId(card?.id ?? null)}
                disabled={cardVersionOptions.length < 2}
                value={selectedCard}
                autoSelect
                autoHighlight
            />
        </td>
        <td>
            <input
                type="checkbox"
                title="Foil"
                checked={state.foil}
                onChange={setFoil}
                disabled={isFoilCheckboxDisabled}
            />
        </td>
        <td>
            <IconButton
                title="Submit"
                onClick={submit}
                icon={icons.ok}
                disabled={isSubmitButtonDisabled}
            />
            <IconButton
                title="Cancel"
                onClick={cancel}
                icon={icons.cancel}
                disabled={isCancelButtonDisabled}
            />
        </td>
    </tr>);
}
export default AddCardRow;