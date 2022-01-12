import * as React from "react";
import { Card } from 'scryfall-api';
import { DebounceInput } from "react-debounce-input";
import CardSuggestion from "./card-suggestion";
import { CardName } from "../logic/model";
import { orderBy } from "lodash";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../store";
import { CurrentSelectionActionTypes } from "../store/currentSelection";

type Props = {
};

const CardSearch = (props: Props) => {
    const dispatch = useDispatch();

    const cardNames : CardName[] = useSelector(
        (state: RootState) => state.encyclopedia.cardNames
    );

    const [suggestions, setSuggestions] = React.useState([]);
    const [query, setQuery] = React.useState('');
    const [activeSuggestionIndex, setActiveSuggestionIndex] = React.useState(null);

    function queryCardsLocal(query: string) : Array<CardName> {
        const q = query.toLowerCase();
        const matches = cardNames.filter(c => c.normalizedName.includes(q));
        const sorted = orderBy(matches, x => x.normalizedName);
        return sorted;
    }

    const updateSuggestions = (cards) => {
        console.log(cards);
        setSuggestions(cards);
        if (cards.length === 0) {
            setActiveSuggestionIndex(null);
        }
        else {
            setActiveSuggestionIndex(0);
        }
    }

    const updateQuery = (query) => {
        const q = query?.trim() || "";
        setQuery(q);
        const cards = q === "" ? [] : queryCardsLocal(q);
        return updateSuggestions(cards);
    }

    const onSuggestionClicked : (card: Card) => Promise<void> = async card => {
        console.log(`You clicked ${card.name}`);

        dispatch({
            type: CurrentSelectionActionTypes.SelectCardName,
            card: card
        });
    }

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
                    dispatch({
                        type: CurrentSelectionActionTypes.SelectCardName,
                        card: suggestions[activeSuggestionIndex]
                    });
                    updateQuery('');
                }
                break;
            default:
                return;
        }
    }

    return (
        <div className="card-search">
            <DebounceInput
                className="card-search-input"
                onChange={e => updateQuery(e.target.value)}
                minLength={3}
                debounceTimeout={300}
                onKeyDown={onKeyDown}
                value={query}
            />
            <div className="card-search-result-list">
                {suggestions.map((c, i) => (
                    <CardSuggestion
                        key={i.toString()}
                        card={c}
                        onClick={onSuggestionClicked}
                        isActive={activeSuggestionIndex === i}
                    />
                ))}
            </div>
        </div>
    );
};
export default CardSearch;