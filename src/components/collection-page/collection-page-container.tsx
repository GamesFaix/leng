import * as React from 'react';
import { BoxCard, defaultCardFilter } from '../../logic/model';
import { getCards } from '../../logic/card-filters';
import CollectionPage from './collection-page';
import { useSelector } from 'react-redux';
import selectors from '../../store/selectors';

function getCount(cards: BoxCard[]) : number {
    return cards.map(c => c.count).reduce((a,b) => a+b, 0);
}

const CollectionPageContainer = () => {
    const [filter, setFilter] = React.useState(defaultCardFilter);
    const boxes = useSelector(selectors.boxes);
    const cards = getCards(boxes, filter);
    const cardCount = getCount(cards);

    return (
        <CollectionPage
            cards={cards}
            cardCount={cardCount}
            filter={filter}
            setFilter={setFilter}
        />
    );
}
export default CollectionPageContainer;