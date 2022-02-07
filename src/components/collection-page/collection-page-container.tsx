import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { BoxCard, defaultCardFilter } from '../../logic/model';
import { getCards } from '../../logic/card-filters';
import CollectionPage from './collection-page';
import { useSelector } from 'react-redux';
import selectors from '../../store/selectors';

function getCount(cards: BoxCard[]) : number {
    return cards.map(c => c.count).reduce((a,b) => a+b, 0);
}

const CollectionPageContainer = () => {
    const navigate = useNavigate();
    const [filter, setFilter] = React.useState(defaultCardFilter);
    const boxes = useSelector(selectors.boxes);
    const cards = getCards(boxes, filter);
    const cardCount = getCount(cards);

    return (
        <CollectionPage
            cards={cards}
            cardCount={cardCount}
            navigate={navigate}
            filter={filter}
            setFilter={setFilter}
        />
    );
}
export default CollectionPageContainer;