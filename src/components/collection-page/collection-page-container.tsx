import * as React from 'react';
import { BoxCard, defaultCardFilter } from '../../logic/model';
import { getCards } from '../../logic/card-filters';
import CollectionPage from './collection-page';
import { useDispatch, useSelector } from 'react-redux';
import selectors from '../../store/selectors';
import { inventoryActions } from '../../store/inventory';

function getCount(cards: BoxCard[]) : number {
    return cards.map(c => c.count).reduce((a,b) => a+b, 0);
}

const CollectionPageContainer = () => {
    const [filter, setFilter] = React.useState(defaultCardFilter);
    const dispatch = useDispatch();
    const boxes = useSelector(selectors.boxes);
    const setsWithCards = useSelector(selectors.setsWithCards);
    const cards = getCards(boxes, filter, setsWithCards);
    const cardCount = getCount(cards);

    return (
        <CollectionPage
            cards={cards}
            cardCount={cardCount}
            filter={filter}
            setFilter={setFilter}
            exportCsv={() => dispatch(inventoryActions.csvExportStart())}
        />
    );
}
export default CollectionPageContainer;