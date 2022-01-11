import * as React from "react";
import { Card } from "scryfall-api";

type Props = {
    card: Card,
    onClick: (card: Card) => void
};

const CardSuggestion = (props: Props) => {
    return (
        <button
            className="card-suggestion"
            onClick={e => props.onClick(props.card)}
        >
            {props.card.name}
        </button>
    );
};
export default CardSuggestion;