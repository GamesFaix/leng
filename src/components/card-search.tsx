import * as React from "react";
import * as Scryfall from 'scryfall-api';
import { DebounceInput } from "react-debounce-input";
import CardSuggestion from "./card-suggestion";

type Props = {

};

async function queryCards(query: string) : Promise<Array<Scryfall.Card>> {
    // Page size is fixed at 175, at least in the client library
    return await Scryfall.Cards.search(query).all();
}

const CardSearch = (props: Props) => {

    let [cards, setCards] = React.useState([]);

    const onQueryChanged : (e: any) => Promise<void> = async e => {
        const query = e.target.value?.trim() || "";
        if (query !== "") {
            const cards = await queryCards(query);
            return setCards(cards);
        }
    }

    const onCardClicked : (card: Scryfall.Card) => Promise<void> = async card => {
        console.log(`You clicked ${card.name}`);
    }

    return (
        <div className="card-search">
            <DebounceInput
                className="card-search-input"
                onChange={onQueryChanged}
                minLength={3}
                debounceTimeout={300}
            />
            <div className="card-search-result-list">
                {cards.map((c, i) => { return (
                    <CardSuggestion
                        key={i.toString()}
                        card={c}
                        onClick={onCardClicked}
                    />
                );})}
            </div>
        </div>
    );
};
export default CardSearch;