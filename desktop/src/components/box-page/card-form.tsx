import * as React from 'react';
import { icons } from 'leng-core/src/ui/fontawesome';
import { AllLanguages, BoxCard, CardFinish, getVersionLabel, Language, normalizeName } from "leng-core/src/logic/model";
import { Autocomplete, FilterOptionsState, IconButton, TextField } from '@mui/material';
import { Card, Set } from 'scryfall-api';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { shell } from 'electron';
import { orderBy } from 'lodash';
import SetSymbol from '../common/set-symbol';
import { useSelector } from 'react-redux';
import selectors from 'leng-core/src/store/selectors';
import FlagIcon from '../common/flag-icon';
import { CardImageTooltip } from '../common/card-image-tooltip';
import CollapsableCard from '../common/collapsable-card';

type Props = {
    title: string
    card: BoxCard | null,
    onSubmit: (card: BoxCard) => void,
    onCancel: () => void
}

type State = {
    cardNameQuery: string,
    cardName: string | null,
    setName: string | null,
    scryfallId: string | null,
    finish: CardFinish | null,
    count: number,
    lang: Language
}

enum SubmitMode {
    ClearAll,
    ClearAllButName,
    ClearAllButNameAndSet
}

const defaultState : State = {
    cardNameQuery: '',
    cardName: null,
    setName: null,
    scryfallId: null,
    finish: null,
    count: 1,
    lang: Language.English
};

function stateFromCard (card: BoxCard | null, sets: Set[]) : State {
    if (!card) { return defaultState; }

    const setName = sets.find(s => s.code === card.setAbbrev)?.name ?? '';

    return {
        cardNameQuery: card.name,
        cardName: card.name,
        setName: setName,
        scryfallId: card.scryfallId,
        finish: card.finish,
        count: card.count,
        lang: card.lang ?? Language.English
    };
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

    let results = options;

    if (query.endsWith("\"")) {
        const normalizedQuery = query.toLowerCase().replace("\"", '');
        results = results.filter(c => normalizeName(c) === normalizedQuery);
    }
    else {
        const normalizedQuery = normalizeName(query);
        results = results.filter(c => normalizeName(c).includes(normalizedQuery));
    }

    results = orderBy(results, normalizeName);

    return results;
}

const CardOption = (props: any, card: Card & { label: string }, state: any) => {
    const classes = state.selected
        ? [ "autocomplete-option", "selected" ]
        : [ "autocomplete-option" ];

    return (
        <CardImageTooltip scryfallId={card.id} key={card.label}>
            <li {...props} classes={classes}>
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
        </CardImageTooltip>
    );
}

const SetOption = (props: any, set: Set, state: any) => {
    const classes = state.selected
        ? [ "autocomplete-option", "selected", "set-container" ]
        : [ "autocomplete-option", "set-container" ];

    return (
        <li {...props} key={set.code} classes={classes}>
            <SetSymbol setAbbrev={set.code}/>
            <div>
                {`${set.name} (${set.code.toUpperCase()})`}
            </div>
        </li>
    );
}

const LangOption = (props: any, lang: Language, state: any) => {
    const classes = state.selected
        ? [ "autocomplete-option", "selected", "set-container" ]
        : [ "autocomplete-option", "set-container" ];

    return (
        <li {...props} key={lang} classes={classes}>
            <FlagIcon lang={lang}/>
            <div style={{ paddingLeft: '6px' }}>
                {lang}
            </div>
        </li>
    );
}

const FinishOption = (props: any, value: CardFinish, state: any) => {
    const classes = state.selected
        ? [ "autocomplete-option", "selected", "set-container" ]
        : [ "autocomplete-option", "set-container" ];

    return (
        <li {...props} key={value} classes={classes}>
            <div style={{ paddingLeft: '6px' }}>
                {value}
            </div>
        </li>
    );
}

const CardForm = (props: Props) => {
    const sets = useSelector(selectors.sets);
    const startingState = stateFromCard(props.card, sets);
    const [state, setState] = React.useState(startingState);
    const allCardNames = useSelector(selectors.cardNames);
    const setOptions = useSelector(selectors.setsOfCard(state.cardName))
        .map(s => { return { ...s, label: `${s.name} (${s.code.toUpperCase()})` }});
    const cardVersionOptions = useSelector(selectors.cardsOfNameAndSetName(state.cardName, state.setName))
        .map(c => { return { ...c, label: getVersionLabel(c) }})
        .sort(compareCards);
    const selectedSet = setOptions.find(s => s.name === state.setName) ?? null;
    const selectedCard = cardVersionOptions.find(c => c.id === state.scryfallId) ?? null;
    const finishOptions = (selectedCard as any)?.finishes ?? [];

    React.useEffect(() => {
        if (setOptions.length === 1 && !state.setName) {
            setSetName(setOptions[0].name);
        }
        else if (cardVersionOptions.length === 1 && !state.scryfallId) {
            setScryfallId(cardVersionOptions[0].id);
        }
        else if (finishOptions.length >= 1 && state.finish === null) {
            setFinish(finishOptions[0]);
        }
    });

    const formStartRef = React.useRef<HTMLInputElement>(null);

    const isSubmitButtonDisabled = state.cardName === null || state.setName === null || state.scryfallId === null || state.finish === null;
    const isCancelButtonDisabled = state.cardName === null && state.setName === null && state.scryfallId === null && state.finish === null;

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
            finish: null
        });
    };

    const setSetName = (name: string | null) => {
        setState({
            ...state,
            setName: name,
            scryfallId: null,
            finish: null,
        });
    };

    const setScryfallId = (id: string | null) => {
        setState({
            ...state,
            scryfallId: id,
            finish: null,
        });
    };

    const setFinish = (value: CardFinish | null) => {
        setState({
            ...state,
            finish: value
        });
    };

    const setLang = (value: Language | null) => {
        setState({
            ...state,
            lang: value ?? Language.English
        });
    }

    const submit = (mode: SubmitMode) => {
        if (!state.cardName || !selectedCard || state.finish === null || !state.scryfallId) {
            console.log(state);
            console.log(selectedCard);
            throw "Card data missing"
        }

        const card: BoxCard = {
            name: state.cardName,
            setAbbrev: selectedCard.set,
            setName: selectedCard.set_name,
            finish: state.finish,
            count: state.count,
            scryfallId: state.scryfallId,
            lang: state.lang,
            collectorsNumber: selectedCard.collector_number,
            color: selectedCard.colors ?? [],
            colorIdentity: selectedCard.color_identity,
            versionLabel: getVersionLabel(selectedCard),
            normalizedName: normalizeName(state.cardName),
            legalities: selectedCard.legalities
        };

        props.onSubmit(card);

        const newState = {
            ...defaultState
        };

        switch (mode) {
            case SubmitMode.ClearAll:
                break;
            case SubmitMode.ClearAllButName:
                newState.cardName = card.name;
                break;
            case SubmitMode.ClearAllButNameAndSet:
                newState.cardName = card.name;
                newState.setName = selectedCard.set_name;
                break;
        }

        setState(newState);

        formStartRef.current?.focus();
    };

    const cancel = () => {
        props.onCancel();
        setState(defaultState);
        formStartRef.current?.focus();
    };

    return (
        <CollapsableCard title={props.title}>
            <form>
                <div className="form-row">
                    <Autocomplete
                        className="control"
                        options={allCardNames}
                        sx={{ width: 300 }}
                        renderInput={(params) =>
                            <TextField {...params}
                                inputRef={formStartRef}
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
                        renderOption={SetOption}
                    />
                    <Autocomplete
                        className="control"
                        options={AllLanguages}
                        sx={{ width: 200 }}
                        renderInput={(params) =>
                            <TextField {...params}
                                label="Language"
                                onFocus={e => e.target.select()}
                            />}
                        renderOption={LangOption}
                        onChange={(e, lang, reason) => setLang(lang)}
                        value={state.lang}
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
                    <Autocomplete
                        className='control'
                        options={finishOptions}
                        sx={{ width: 250 }}
                        renderInput={(params) =>
                            <TextField {...params}
                                label="Finish"
                                onFocus={e => e.target.select()}
                            />}
                        onChange={(e, value, reason) => setFinish(value)}
                        disabled={finishOptions.length < 2}
                        value={state.finish}
                        autoSelect
                        autoHighlight
                        selectOnFocus
                        openOnFocus
                        renderOption={FinishOption}
                    />
                    <TextField
                        className="control"
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
                    {props.card === null ? <>
                        <IconButton
                            className="control"
                            onClick={() => submit(SubmitMode.ClearAll)}
                            title="Add"
                            disabled={isSubmitButtonDisabled}
                            color="success"
                        >
                            <FontAwesomeIcon icon={icons.add}/>
                        </IconButton>
                        <IconButton
                            className="control"
                            onClick={() => submit(SubmitMode.ClearAllButName)}
                            title="Add, then add another card with the same name"
                            disabled={isSubmitButtonDisabled}
                            color="secondary"
                        >
                            <FontAwesomeIcon icon={icons.add}/>
                            <FontAwesomeIcon icon={icons.badge}/>
                        </IconButton>
                        <IconButton
                            className="control"
                            onClick={() => submit(SubmitMode.ClearAllButNameAndSet)}
                            title="Add, then add another card with the same name and set"
                            disabled={isSubmitButtonDisabled}
                            color="secondary"
                        >
                            <FontAwesomeIcon icon={icons.add}/>
                            <FontAwesomeIcon icon={icons.art}/>
                        </IconButton>
                    </> : <>
                        <IconButton
                            className="control"
                            onClick={() => submit(SubmitMode.ClearAll)}
                            title="Done editing"
                            disabled={isSubmitButtonDisabled}
                            color="success"
                        >
                            <FontAwesomeIcon icon={icons.ok}/>
                        </IconButton>
                    </>}
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
            </form>
        </CollapsableCard>
    );
}

type AddFormProps = {
    onSubmit: (card: BoxCard) => void,
    onCancel: () => void
}

type EditFormProps = {
    card: BoxCard | null,
    onSubmit: (card: BoxCard) => void,
    onCancel: () => void
}

export const AddCardForm = (props: AddFormProps) => CardForm({ ...props, card: null, title: "Add card" });
export const EditCardForm = (props: EditFormProps) => CardForm({ ...props, title: "Edit card" });