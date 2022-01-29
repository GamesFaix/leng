import * as React from 'react';
import { icons } from '../../fontawesome';
import { useStore } from '../../hooks';
import { AllLanguages, BoxCard, Language, normalizeName, SetInfo } from '../../logic/model';
import { Autocomplete, Checkbox, FilterOptionsState, FormControlLabel, IconButton, TextField } from '@mui/material';
import { Card } from 'scryfall-api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { shell } from 'electron';

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
    count: number,
    lang: Language
}

const defaultState : State = {
    cardNameQuery: '',
    cardName: null,
    setName: null,
    scryfallId: null,
    foil: null,
    count: 1,
    lang: Language.English
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
        count: card.count,
        lang: card.lang ?? Language.English
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

function compareCards(a: Card, b: Card) {
    const pattern = /(\d+)(.*)/
    const matchA = pattern.exec(a.collector_number);
    const matchB = pattern.exec(b.collector_number);
    const numA = Number(matchA![1]);
    const numB = Number(matchB![1]);
    if (numA < numB) {
        return -1;
    } else if (numA > numB) {
        return 1;
    }

    const mscA = matchA![2];
    const mscB = matchB![2];
    if (mscA < mscB) {
        return -1;
    } else if (mscA > mscB) {
        return 1;
    }

    return 0;
}

function filterCardNames (options: string[], state: FilterOptionsState<string>) {
    const query = state.inputValue;

    if (query.length < 3) {
        return [];
    }

    if (query.endsWith('\"')) {
        const normalizedQuery = query.toLowerCase().replace('\"', '');
        return options.filter(c => c.toLowerCase() === normalizedQuery);
    }
    else {
        const normalizedQuery = normalizeName(query);
        return options.filter(c => normalizeName(c).includes(normalizedQuery));
    }
}

const CardOption = (props: any, card: Card & { label: string }, state: any) => {
    const classes = state.selected
        ? [ "autocomplete-option", "selected" ]
        : [ "autocomplete-option" ];

    return (
        <li {...props} key={card.label} classes={classes}>
            <div>
                {card.label}
            </div>
            <IconButton
                onClick={() => shell.openExternal(card.scryfall_uri)}
                title="View on Scryfall"
                color="primary"
            >
                <FontAwesomeIcon icon={icons.inspect} />
            </IconButton>
        </li>
    );
}

const CardForm = (props: Props) => {
    const sets = useStore.sets();
    const startingState = stateFromCard(props.card, sets);
    const [state, setState] = React.useState(startingState);
    const allCardNames = useStore.cardNames();
    const setOptions = useStore.setsOfCard(state.cardName ?? '')
        .map(s => { return { ...s, label: `${s.name} (${s.abbrev.toUpperCase()})` }});
    const cardVersionOptions = useStore.cardsOfNameAndSetName(state.cardName ?? '', state.setName ?? '')
        .map(c => { return { ...c, label: getVersionLabel(c) }})
        .sort(compareCards);
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

    const setLang = (value: Language | null) => {
        setState({
            ...state,
            lang: value ?? Language.English
        });
    }

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
            scryfallId: state.scryfallId,
            lang: state.lang
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

    return (<form>
        <div className="form-row">
            <TextField
                className="control"
                inputRef={countInputRef}
                type="number"
                title="Count"
                inputProps={{
                    min: 1,
                    max: 1000,
                }}
                sx={{ width: 75 }}
                value={state.count}
                onChange={setCount}
                onFocus={e => e.target.select()}
            />
            <Autocomplete
                className="control"
                options={allCardNames}
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
                filterOptions={filterCardNames}
            />
            <Autocomplete
                className="control"
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
        </div>
        <div className="form-row">
            <Autocomplete
                className="control"
                options={cardVersionOptions}
                sx={{ width: 250 }}
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
                renderOption={CardOption}
            />
            <FormControlLabel
                label="Foil"
                labelPlacement='top'
                control={
                    <Checkbox
                        className="control"
                        title="Foil"
                        checked={state.foil ?? false}
                        onChange={e => setFoil(e.target.checked)}
                        disabled={foilOptions.length < 2}
                    />
                }
            />
            <Autocomplete
                className="control"
                options={AllLanguages}
                sx={{ width: 150 }}
                renderInput={(params) =>
                    <TextField {...params}
                        label="Language"
                        onFocus={e => e.target.select()}
                    />}
                onChange={(e, lang, reason) => setLang(lang)}
                value={state.lang}
                autoSelect
                autoHighlight
                selectOnFocus
                openOnFocus
            />
            <IconButton
                className="control"
                onClick={submit}
                title="Submit"
                disabled={isSubmitButtonDisabled}
                color="success"
            >
                <FontAwesomeIcon icon={icons.ok}/>
            </IconButton>
            <IconButton
                className="control"
                onClick={cancel}
                title="Cancel"
                disabled={isCancelButtonDisabled}
                color="error"
            >
                <FontAwesomeIcon icon={icons.cancel}/>
            </IconButton>
        </div>
    </form>);
}

type AddFormProps = {
    onSubmit: (card: BoxCard) => void,
    onCancel: () => void
}

export const AddCardForm = (props: AddFormProps) => CardForm({ ...props, card: null });
export const EditCardForm = (props: Props) => CardForm(props);