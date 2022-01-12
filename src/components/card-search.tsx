import * as React from "react";
import { Card } from 'scryfall-api';
import { DebounceInput } from "react-debounce-input";
import CardSuggestion from "./card-suggestion";
import { CardName } from "../logic/model";
import { orderBy } from "lodash";

type Props = {
    cards: CardName[],
    onSelection: (card: CardName) => void
};

const CardSearch = (props: Props) => {

    function queryCardsLocal(query: string) : Array<CardName> {
        const q = query.toLowerCase();
        const matches = props.cards.filter(c => c.normalizedName.includes(q));
        const sorted = orderBy(matches, x => x.normalizedName);
        return sorted;
    }

    const [cards, setCards] = React.useState([]);
    const [activeIndex, setActiveIndex] = React.useState(null);
    const [query, setQuery] = React.useState('');

    const updateCards = (cards) => {
        console.log(cards);
        setCards(cards);
        if (cards.length === 0) {
            setActiveIndex(null);

        } else {
            setActiveIndex(0);
        }
    }

    const updateQuery = (query) => {
        const q = query?.trim() || "";
        setQuery(q);
        const cards = q === "" ? [] : queryCardsLocal(q);
        return updateCards(cards);
    }

    const onCardClicked : (index: number, card: Card) => Promise<void> = async (index, card) => {
        console.log(`You clicked ${card.name}`);
        setActiveIndex(index);
    }

    const onKeyDown = (e: React.KeyboardEvent) => {
        switch(e.code) {
            case 'ArrowUp':
                if (cards.length > 0 && activeIndex > 0) {
                    setActiveIndex(activeIndex - 1);
                }
                break;
            case 'ArrowDown':
                if (cards.length > 0 && activeIndex < cards.length - 1){
                    setActiveIndex(activeIndex + 1);
                }
                break;
            case 'Enter':
                if (activeIndex !== null) {
                    props.onSelection(cards[activeIndex]);
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
                {cards.map((c, i) => { return (
                    <CardSuggestion
                        key={i.toString()}
                        card={c}
                        onClick={c => onCardClicked(i, c)}
                        isActive={activeIndex === i}
                    />
                );})}
            </div>
        </div>
    );
};
export default CardSearch;