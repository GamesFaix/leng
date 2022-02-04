import { Card, IconButton, Typography } from '@mui/material';
import * as React from 'react';
import CardsTable from './cards-table';
import { groupBy, orderBy } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../../fontawesome';
import { useNavigate } from 'react-router-dom';
import { BoxCard, BoxCardModule, defaultCardFilter } from '../../logic/model';
import CardFilterForm from './card-filter-form';
import { useStore } from '../../hooks';

type Props = {

}

function getCards(boxes: BoxState[]) : BoxCard[] {
    return boxes.map(b => b.cards ?? []).reduce((a, b) => a.concat(b), []);
}

function combineDuplicates(cards: BoxCard[]) : BoxCard[] {
    const groups = groupBy(cards, BoxCardModule.getKey);
    return Object.entries(groups)
        .map(grp => {
            const [_, cards] = grp;
            return {
                ...cards[0],
                count: cards.map(c => c.count).reduce((a, b) => a+b, 0)
            };
        });
}

const CollectionPage = (props: Props) => {
    const navigate = useNavigate();

    const [filter, setFilter] = React.useState(defaultCardFilter);
    const boxes = useStore.boxes();

    let cards = getCards(boxes);
    cards = combineDuplicates(cards);
    cards = orderBy(cards, ['name', 'set', 'version']);

    const cardCount = cards.map(c => c.count).reduce((a,b) => a+b, 0);

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