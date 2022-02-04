import { Card, IconButton, Typography } from '@mui/material';
import * as React from 'react';
import CardsTable from './cards-table';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { groupBy, orderBy } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../../fontawesome';
import { useNavigate } from 'react-router-dom';
import { BoxCardModule, defaultCardFilter } from '../../logic/model';
import CardFilterForm from './card-filter-form';

type Props = {

}

const CollectionPage = (props: Props) => {
    const navigate = useNavigate();

    const [filter, setFilter] = React.useState(defaultCardFilter);

    const boxes = useSelector((state: RootState) => state.inventory.boxes) ?? [];
    let cards = boxes.map(b => b.cards ?? []).reduce((a, b) => a.concat(b), []);
    const groups = groupBy(cards, BoxCardModule.getKey);
    cards = Object.entries(groups)
        .map(grp => {
            const [_, cards] = grp;
            return {
                ...cards[0],
                count: cards.map(c => c.count).reduce((a, b) => a+b, 0)
            };
        });
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