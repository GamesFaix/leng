import { Card, IconButton, Typography } from '@mui/material';
import * as React from 'react';
import CardsTable from './cards-table';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { groupBy, orderBy } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../../fontawesome';
import { useNavigate } from 'react-router-dom';
import { BoxCard, BoxCardModule, normalizeName } from '../../logic/model';
import { BoxState } from '../../store/inventory';
import FilterForm, { CardFilter, defaultCardFilter } from './filter-form';

type Props = {

}

function combineBoxes(boxes: BoxState[]) : BoxCard[] {
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
    return cards;
}

function search(cards: BoxCard[], filter: CardFilter) {
    if (filter.nameQuery.length > 0) {
        cards = cards.filter(c => normalizeName(c.name).includes(filter.nameQuery));
    }

    if (filter.set) {
        cards = cards.filter(c => c.details?.set_name === filter.set!.name);
    }

    cards = cards.filter(c => {
        const colors = c?.details?.colors ?? [];

        // If its colorless and you explicitly selected colorless, include it
        if (colors.length === 0 && filter.colors.includes('C')) {
            return true;
        }

        // If any of its colors match any colors in the filter, include it
        for (let cc of colors) {
            for (let fc of filter.colors) {
                if (cc === fc) {
                    return true;
                }
            }
        }

        return false;
    })

    return cards;
}

const CollectionPage = (props: Props) => {
    const navigate = useNavigate();

    const boxes = useSelector((state: RootState) => state.inventory.boxes) ?? [];
    const [filter, setFilter] = React.useState(defaultCardFilter);

    let cards = combineBoxes(boxes);
    cards = search(cards, filter);
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
            <FilterForm
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