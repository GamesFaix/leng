import * as React from 'react';
import { icons } from '../../fontawesome';
import { useStore } from '../../hooks';
import { BoxCard, normalizeName, SetInfo } from '../../logic/model';
import { Autocomplete, Checkbox, IconButton, TableCell, TableRow, TextField } from '@mui/material';
import { Card } from 'scryfall-api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

type Props = {
    card: BoxCard | null,
    onSubmit: (card: BoxCard) => void,
    onCancel: () => void
}

type State = {
    cardNameQuery: string,
    cardName: string | null,
    setName: string | null,
    scryfallId: string | null,
    foil: boolean | null,
    count: number
}

const defaultState : State = {
    cardNameQuery: '',
    cardName: null,
    setName: null,
    scryfallId: null,
    foil: null,
    count: 1
};

function stateFromCard (card: BoxCard | null, sets: SetInfo[]) : State {
    if (!card) { return defaultState; }

    const setName = sets.find(s => s.abbrev === card.setAbbrev)?.name ?? '';

    return {
        cardNameQuery: card.name,
        cardName: card.name,
        setName: setName,
        scryfallId: card.scryfallId,
        foil: card.foil,
        count: card.count
    };
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

function getFoilOptions(card: Card | null) {
    const xs = [];
    if (card?.nonfoil) { xs.push(false); }
    if (card?.foil) { xs.push(true); }
    return xs;
}

const ActiveCardRow = (props: Props) => {
    const sets = useStore.sets();
    const startingState = stateFromCard(props.card, sets);
    const [state, setState] = React.useState(startingState);
    const allCardNames = useStore.cardNames();
    const [cardNameOptions, setCardNameOptions] = React.useState<string[]>([]);
    const setOptions = useStore.setsOfCard(state.cardName ?? '')
        .map(s => { return { ...s, label: `${s.name} (${s.abbrev.toUpperCase()})` }});
    const cardVersionOptions = useStore.cardsOfNameAndSetName(state.cardName ?? '', state.setName ?? '')
        .map(c => { return { ...c, label: getVersionLabel(c) }});
    const selectedSet = setOptions.find(s => s.name === state.setName) ?? null;
    const selectedCard = cardVersionOptions.find(c => c.id === state.scryfallId) ?? null;
    const foilOptions = getFoilOptions(selectedCard);

    React.useEffect(() => {
        if (setOptions.length === 1 && !state.setName) {
            setSetName(setOptions[0].name);
        }
        else if (cardVersionOptions.length === 1 && !state.scryfallId) {
            setScryfallId(cardVersionOptions[0].id);
        }
        else if (foilOptions.length >= 1 && state.foil === null) {
            setFoil(foilOptions[0]);
        }
    });

    const countInputRef = React.useRef<HTMLInputElement>(null);

    const isSubmitButtonDisabled = state.cardName === null || state.setName === null || state.scryfallId === null || state.foil === null;
    const isCancelButtonDisabled = state.cardName === null && state.setName === null && state.scryfallId === null && state.foil === null;

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
                : allCardNames.filter(x => normalizeName(x).includes(normalizeName(query)));

        setCardNameOptions(cardNameOptions);
    };

    const setCardName = (name: string | null) => {
        setState({
            ...state,
            cardName: name,
            setName: null,
            scryfallId: null,
            foil: null,
        });
    };

    const setSetName = (name: string | null) => {
        setState({
            ...state,
            setName: name,
            scryfallId: null,
            foil: null,
        });
    };

    const setScryfallId = (id: string | null) => {
        setState({
            ...state,
            scryfallId: id,
            foil: null,
        });
    };

    const setFoil = (value: boolean) => {
        setState({
            ...state,
            foil: value
        });
    };

    const submit = () => {
        if (!state.cardName || !selectedCard || state.foil === null || !state.scryfallId) {
            console.log(state);
            console.log(selectedCard);
            throw "Card data missing"
        }

        const card: BoxCard = {
            name: state.cardName,
            setAbbrev: selectedCard.set,
            foil: state.foil,
            version: selectedCard.label,
            count: state.count,
            scryfallId: state.scryfallId
        };

        props.onSubmit(card);
        setState(defaultState);
        countInputRef.current?.focus();
    };

    const cancel = () => {
        props.onCancel();
        setState(defaultState);
        countInputRef.current?.focus();
    };

    return (<TableRow>
        <TableCell>
            <TextField
                inputRef={countInputRef}
                type="number"
                title="Count"
                inputProps={{
                    min: 1,
                    max: 1000,
                }}
                sx={{ width: 100 }}
                value={state.count}
                onChange={setCount}
                onFocus={e => e.target.select()}
            />
        </TableCell>
        <TableCell>
            <Autocomplete
                options={cardNameOptions}
                sx={{ width: 300 }}
                renderInput={(params) =>
                    <TextField {...params}
                        label="Card"
                        onFocus={e => e.target.select()}
                    />}
                onChange={(e, value, reason) => setCardName(value)}
                value={state.cardName}
                autoSelect
                autoHighlight
                inputValue={state.cardNameQuery}
                onInputChange={(e, value, reason) => updateCardNameQuery(value)}
                noOptionsText="Type at least 3 characters to search cards..."
            />
        </TableCell>
        <TableCell>
            <Autocomplete
                options={setOptions}
                sx={{ width: 300 }}
                renderInput={(params) =>
                    <TextField {...params}
                        label="Set"
                        onFocus={e => e.target.select()}
                    />}
                onChange={(e, value, reason) => setSetName(value?.name ?? null)}
                disabled={setOptions.length < 2}
                value={selectedSet}
                autoSelect
                autoHighlight
                selectOnFocus
                openOnFocus
            />
        </TableCell>
        <TableCell>
            <Autocomplete
                options={cardVersionOptions}
                sx={{ width: 300 }}
                renderInput={(params) =>
                    <TextField {...params}
                        label="Version"
                        onFocus={e => e.target.select()}
                    />}
                onChange={(e, card, reason) => setScryfallId(card?.id ?? null)}
                disabled={cardVersionOptions.length < 2}
                value={selectedCard}
                autoSelect
                autoHighlight
                selectOnFocus
                openOnFocus
            />
        </TableCell>
        <TableCell>
            <Checkbox
                title="Foil"
                checked={state.foil ?? false}
                onChange={e => setFoil(e.target.checked)}
                disabled={foilOptions.length < 2}
            />
        </TableCell>
        <TableCell>
            <IconButton
                onClick={submit}
                title="Submit"
                disabled={isSubmitButtonDisabled}
                color="success"
            >
                <FontAwesomeIcon icon={icons.ok}/>
            </IconButton>
            <IconButton
                onClick={cancel}
                title="Cancel"
                disabled={isCancelButtonDisabled}
                color="error"
            >
                <FontAwesomeIcon icon={icons.cancel}/>
            </IconButton>
        </TableCell>
    </TableRow>);
}
export default ActiveCardRow;