import { Card, IconButton, Typography } from '@mui/material';
import * as React from 'react';
import CardsTable from './cards-table';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../../fontawesome';
import { useNavigate } from 'react-router-dom';
import { BoxCard, defaultCardFilter } from '../../logic/model';
import CardFilterForm from './card-filter-form';
import { useStore } from '../../hooks';
import { getCards } from '../../logic/card-filters';

type Props = {

}

function getCount(cards: BoxCard[]) : number {
    return cards.map(c => c.count).reduce((a,b) => a+b, 0);
}

const CollectionPage = (props: Props) => {
    const navigate = useNavigate();

    const [filter, setFilter] = React.useState(defaultCardFilter);
    const boxes = useStore.boxes();

    const cards = getCards(boxes, filter);
    const cardCount = getCount(cards);

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
                    <Typography variant="h3">
                        Your collection
                    </Typography>
                    <Typography sx={{ fontStyle: "italic" }}>
                        {cardCount} cards
                    </Typography>
                </div>
                <div
                    style={{
                        display: 'flex',
                        alignItems: 'end',
                        flexDirection: 'column',
                    }}
                >
                    <IconButton
                        title="Home"
                        onClick={() => {
                            navigate('/', { replace: true });
                        }}
                        color='primary'
                    >
                        <FontAwesomeIcon icon={icons.home}/>
                    </IconButton>
                </div>
            </Card>
            <br/>
            <CardFilterForm
                filter={filter}
                onChange={setFilter}
            />
            <br/>
            <Card sx={{ width: 900, padding: 1 }}>
                <CardsTable
                    cards={cards}
                />
            </Card>
        </div>
    );
}
export default CollectionPage;