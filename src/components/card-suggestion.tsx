import * as React from "react";
import { Card } from "scryfall-api";

type Props = {
    card: Card,
    isActive: boolean,
    onClick: (card: Card) => void
};

const CardSuggestion = (props: Props) => {
    const className = props.isActive
        ? "card-suggestion active"
        : "card-suggestion";

    return (
        <button
            className={className}
            onClick={() => props.onClick(props.card)}
        >
            {props.card.name}
        </button>
    );
};
export default CardSuggestion;