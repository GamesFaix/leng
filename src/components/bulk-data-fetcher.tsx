import * as React from 'react';
import { loadCards } from '../logic/bulk-data-controller';

type Props = {

}

const BulkDataFetcher = (props: Props) => {

    React.useEffect(() => {
        loadCards()
            .then(cards => console.log(cards));
    });

    return (
        <div className="bulk-data-fetcher">

        </div>
    );
};
export default BulkDataFetcher;
