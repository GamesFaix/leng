import * as React from 'react';
import { icons } from '../../fontawesome';
import { useStore } from '../../hooks';
import { BoxCard, normalizeName, SetInfo } from '../../logic/model';
import { Autocomplete, Button, Checkbox, TableCell, TableRow, TextField } from '@mui/material';
import { Card, Set } from 'scryfall-api';
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
    const setNameOptions = useStore.setNamesOfCardName(state.cardName ?? '');
    const cardVersionOptions = useStore.cardsOfNameAndSetName(state.cardName ?? '', state.setName ?? '')
        .map(c => { return { ...c, label: getVersionLabel(c) }});
    const selectedCard = cardVersionOptions.find(c => c.id === state.scryfallId) ?? null;
    const foilOptions = getFoilOptions(selectedCard);

    React.useEffect(() => {
        if (setNameOptions.length === 1 && !state.setName) {
            setSetName(setNameOptions[0]);
        }
        else if (cardVersionOptions.length === 1 && !state.scryfallId) {
            setScryfallId(cardVersionOptions[0].id);
        }
        else if (foilOptions.length >= 1 && state.foil === null) {
            setFoil(foilOptions[0]);
        }
    });

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
                : allCardNames.filter(x => normalizeName(x).includes(query.toLowerCase()));

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
    };

    const cancel = () => {
        props.onCancel();
        setState(defaultState);
    };

    return (<TableRow>
        <TableCell>
            <TextField
                type="number"
                title="Count"
                inputProps={{
                    min: 1,
                    max: 1000,
                }}
                sx={{ width: 100 }}
                value={state.count}
                onChange={setCount}
                autoFocus
                onFocus={e => e.target.select()}
            />
        </TableCell>
        <TableCell>
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
        </TableCell>
        <TableCell>
            <Autocomplete
                options={setNameOptions}
                sx={{ width: 300 }}
                renderInput={(params) => <TextField {...params} label="Set" />}
                onChange={(e, value, reason) => setSetName(value)}
                disabled={setNameOptions.length < 2}
                value={state.setName}
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
                renderInput={(params) => <TextField {...params} label="Version" />}
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
            <Button
                onClick={submit}
                title="Submit"
                disabled={isSubmitButtonDisabled}
                variant="contained"
                color="success"
            >
                <FontAwesomeIcon icon={icons.ok}/>
            </Button>
            <Button
                onClick={cancel}
                title="Cancel"
                disabled={isCancelButtonDisabled}
                variant="outlined"
                color="error"
            >
                <FontAwesomeIcon icon={icons.cancel}/>
            </Button>
        </TableCell>
    </TableRow>);
}
export default ActiveCardRow;