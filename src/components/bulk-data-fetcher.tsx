import * as React from 'react';
import { loadCards } from '../logic/bulk-data-controller';
import { Card, Cards } from 'scryfall-api';

type Props = {
    cards: Card[],
    onLoad: (cards: Card[]) => void
}

const BulkDataFetcher = (props: Props) => {

    React.useLayoutEffect(() => {
        if (props.cards.length === 0) {
            loadCards()
                .then(props.onLoad);
        }
    });

    return (
        <div className="bulk-data-fetcher">

        </div>
    );
};
export default BulkDataFetcher;
