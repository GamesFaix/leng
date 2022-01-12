import * as React from "react";
import { Card } from 'scryfall-api';
import { DebounceInput } from "react-debounce-input";
import CardSuggestion from "./card-suggestion";

type Props = {
    cards: Card[],
    onSelection: (card: Card) => void
};

const CardSearch = (props: Props) => {

    function queryCardsLocal(query: string) : Array<Card> {
        const q = query.toLowerCase();
        const matches = props.cards.filter(c => c.name.toLowerCase().includes(q));
        return matches;
    }

    let [cards, setCards] = React.useState([]);
    const [activeIndex, setActiveIndex] = React.useState(null);

    const updateCards = (cards) => {
        setCards(cards);
        if (cards.length === 0) {
            setActiveIndex(null);

        } else {
            setActiveIndex(0);
        }
    }

    const onQueryChanged : (e: any) => void = e => {
        const query = e.target.value?.trim() || "";
        if (query !== "") {
            const cards = queryCardsLocal(query);
            return updateCards(cards);
        }
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
                onChange={onQueryChanged}
                minLength={3}
                debounceTimeout={300}
                onKeyDown={onKeyDown}
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