import { Card, IconButton, Typography } from '@mui/material';
import * as React from 'react';
import CardsTable from './cards-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../../fontawesome';
import { BoxCard, CardFilter } from '../../logic/model';
import CardFilterForm from './card-filter-form';
import { NavigateOptions } from 'react-router-dom';

type Props = {
    cards: BoxCard[],
    cardCount: number,
    navigate: (url: string, options: NavigateOptions) => void,
    filter: CardFilter,
    setFilter: (filter: CardFilter) => void,

}

const CollectionPage = (props: Props) => {
    return (
        <div>
            <Card
                sx={{
                    padding: "6px",
                    width: 700,
                    display: 'flex',
                    justifyContent: 'space-between'
                }}
            >
                <div>
                    <Typography variant="h4">
                        Your collection
                    </Typography>
                    <Typography sx={{ fontStyle: "italic" }}>
                        {props.cardCount} cards
                    </Typography>
                </div>
            </Card>
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