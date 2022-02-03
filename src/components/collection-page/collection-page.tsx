import { Card, IconButton, Typography } from '@mui/material';
import * as React from 'react';
import CardsTable from './cards-table';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { difference, groupBy, intersection, orderBy, uniq } from 'lodash';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../../fontawesome';
import { useNavigate } from 'react-router-dom';
import { Box, BoxCard, BoxCardModule, normalizeName } from '../../logic/model';
import { BoxState } from '../../store/inventory';
import FilterForm, { CardFilter, defaultCardFilter } from './filter-form';
import { Rule } from '../common/color-filter-rule-selector';
import { Color } from '../common/colors-selector';

type Props = {

}

function getCards(boxes: BoxState[]) : BoxCard[] {
    return boxes.map(b => b.cards ?? []).reduce((a,b) => a.concat(b), []);
}

function mergeDuplicates(cards: BoxCard[]) {
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

function combineBoxes(boxes: BoxState[], filter: CardFilter) : BoxCard[] {
    const includeBoxes = filter.fromBoxes.length > 0
        ? boxes.filter(b => filter.fromBoxes.includes(b.name))
        : boxes;

    const exceptBoxes = filter.exceptBoxes.length > 0
        ? boxes.filter(b => filter.exceptBoxes.includes(b.name))
        : [];

    const includeCards = mergeDuplicates(getCards(includeBoxes));
    const exceptKeys = uniq(getCards(exceptBoxes).map(BoxCardModule.getKey));

    let cards = includeCards.filter(c => !exceptKeys.includes(BoxCardModule.getKey(c)));
    cards = orderBy(cards, ['name', 'set', 'version']);
    return cards;
}

function containsAny(cardColors: Color[], filterColors: Color[]) {
    if (cardColors.length === 0 && filterColors.includes('C')) {
        return true;
    }

    return intersection(cardColors, filterColors).length > 0;
}

function containsAll(cardColors: Color[], filterColors: Color[]) {
    if (cardColors.length === 0 && filterColors.length === 1 && filterColors[0] === 'C') {
        return true;
    }

    return intersection(cardColors, filterColors).length === filterColors.length;
}

function containsOnly(cardColors: Color[], filterColors: Color[]) {
    if (cardColors.length === 0) {
        return true;
    }

    return difference(cardColors, filterColors).length === 0;
}

function isColorExactly(cardColors: Color[], filterColors: Color[]) {
    if (cardColors.length === 0 && filterColors.length === 1 && filterColors[0] === 'C') {
        return true;
    }

    for (let fc of filterColors) {
        if (!cardColors.includes(fc as any)) {
            return false;
        }
    }

    return cardColors.length === filterColors.length;
}

function filterCardsByColor(cards: BoxCard[], colors: Color[], rule: Rule) : BoxCard[] {
    switch (rule) {
        case Rule.ContainsAny:
            return cards.filter(c => containsAny(c.details?.colors ?? [], colors));
        case Rule.ContainsAll:
            return cards.filter(c => containsAll(c.details?.colors ?? [], colors));
        case Rule.ContainsOnly:
            return cards.filter(c => containsOnly(c.details?.colors ?? [], colors));
        case Rule.IsExactly:
            return cards.filter(c => isColorExactly(c.details?.colors ?? [], colors));
        case Rule.IdentityContainsAny:
            return cards.filter(c => containsAny(c.details?.color_identity ?? [], colors));
        case Rule.IdentityContainsAll:
            return cards.filter(c => containsAll(c.details?.color_identity ?? [], colors));
        case Rule.IdentityContainsOnly:
            return cards.filter(c => containsOnly(c.details?.color_identity ?? [], colors));
        case Rule.IdentityIsExactly:
            return cards.filter(c => isColorExactly(c.details?.color_identity ?? [], colors));
    }
}

function search(cards: BoxCard[], filter: CardFilter) {
    if (filter.nameQuery.length > 0) {
        cards = cards.filter(c => normalizeName(c.name).includes(filter.nameQuery));
    }

    if (filter.set) {
        cards = cards.filter(c => c.details?.set_name === filter.set!.name);
    }

    cards = filterCardsByColor(cards, filter.colors, filter.colorRule);

    return cards;
}

const CollectionPage = (props: Props) => {
    const navigate = useNavigate();

    const boxes = useSelector((state: RootState) => state.inventory.boxes) ?? [];
    const [filter, setFilter] = React.useState(defaultCardFilter);

    let cards = combineBoxes(boxes, filter);
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