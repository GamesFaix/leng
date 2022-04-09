import { Card, IconButton, Typography } from '@mui/material';
import * as React from 'react';
import CardsTable from './cards-table';
import { BoxCard, CardFilter } from '../../logic/model';
import CardFilterForm from './card-filter-form';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../../fontawesome';

type Props = {
    cards: BoxCard[],
    cardCount: number,
    filter: CardFilter,
    setFilter: (filter: CardFilter) => void,
    exportCsv: () => void
}

const CollectionPage = (props: Props) => {
    return (
        <div>
            <div style={{ display: "flex" }}>
                <div>
                    <Typography variant="h4">
                        Collection
                    </Typography>
                    <Typography sx={{ fontStyle: "italic" }}>
                        {props.cardCount} cards
                    </Typography>
                </div>
                <div>
                    <IconButton
                        title="Export CSV"
                        color='primary'
                        onClick={() => props.exportCsv()}
                    >
                        <FontAwesomeIcon icon={icons.export}/>
                    </IconButton>
                </div>
            </div>
            <br/>
            <CardFilterForm
                filter={props.filter}
                onChange={props.setFilter}
            />
            <br/>
            <Card sx={{ width: 900, padding: 1 }}>
                <CardsTable
                    cards={props.cards}
                />
            </Card>
        </div>
    );
}
export default CollectionPage;