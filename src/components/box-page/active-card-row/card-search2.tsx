import * as React from "react";
import { NamedCard } from "../../../logic/model";
import { orderBy } from "lodash";
import { useSelector } from "react-redux";
import { RootState } from "../../../store";

type Props = {
    selectedCardName: string | null
    onCardSelected: (name: string | null) => void
};

function searchCardNames(query: string, cardNames: NamedCard[]) : NamedCard[] {
    const q = query.toLowerCase();
    const matches = cardNames.filter(c => c.normalizedName.includes(q));
    const sorted = orderBy(matches, x => x.normalizedName);
    return sorted;
}

const CardSearch2 = (props: Props) => {
    const namedCards = useSelector((state: RootState) => state.encyclopedia.namedCards);
    const [query, setQuery] = React.useState(props.selectedCardName ?? '');

    const match = props.selectedCardName ? namedCards.find(c => c.name === props.selectedCardName) ?? null : null;
    const [suggestions, setSuggestions] = React.useState<NamedCard[]>(match ? [ match ] : []);

    return (<div className="new-card-search">
        <input
            value={query}
            onChange={e => {
                const newQuery = e.target.value;
                const newSuggestions = searchCardNames(newQuery, namedCards);
                setQuery(newQuery);
                setSuggestions(newSuggestions);
            }}
            placeholder="Enter card name..."
        />
        <div className="suggestion-container">
            <ul>
                {suggestions.map(namedCard => (
                    <li key={namedCard.name}
                        onClick={() => {
                            props.onCardSelected(namedCard.name);
                            setQuery(namedCard.name);
                            setSuggestions([]);
                        }}
                    >
                        {namedCard.name}
                    </li>
                ))}
            </ul>
        </div>
    </div>);
};
export default CardSearch2;