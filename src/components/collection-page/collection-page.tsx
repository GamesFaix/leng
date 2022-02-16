import { Card, Typography } from '@mui/material';
import * as React from 'react';
import CardsTable from './cards-table';
import { BoxCard, CardFilter } from '../../logic/model';
import CardFilterForm from './card-filter-form';

type Props = {
    cards: BoxCard[],
    cardCount: number,
    filter: CardFilter,
    setFilter: (filter: CardFilter) => void,
}

const CollectionPage = (props: Props) => {
    return (
        <div>
            <div>
                <Typography variant="h4">
                    Collection
                </Typography>
                <Typography sx={{ fontStyle: "italic" }}>
                    {props.cardCount} cards
                </Typography>
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