import * as React from "react";
import * as Scryfall from 'scryfall-api';
import { DebounceInput } from "react-debounce-input";
import CardSuggestion from "./card-suggestion";

type Props = {
    onSelection: (card: Scryfall.Card) => void
};

async function queryCards(query: string) : Promise<Array<Scryfall.Card>> {
    // Page size is fixed at 175, at least in the client library
    return await Scryfall.Cards.search(query).all();
}

const CardSearch = (props: Props) => {

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

    const onQueryChanged : (e: any) => Promise<void> = async e => {
        const query = e.target.value?.trim() || "";
        if (query !== "") {
            const cards = await queryCards(query);
            return updateCards(cards);
        }
    }

    const onCardClicked : (index: number, card: Scryfall.Card) => Promise<void> = async (index, card) => {
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