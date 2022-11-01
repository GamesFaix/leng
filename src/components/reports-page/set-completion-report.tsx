import * as React from 'react';
import { useSelector } from 'react-redux';
import selectors from '../../store/selectors';
import { getCardsFromBoxes } from '../../logic/card-filters';
import { LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { groupBy, orderBy, uniqBy } from 'lodash';
import { BoxCard } from '../../logic/model';
import { Card, Set } from 'scryfall-api';

type SetModel = {
    set: Set,
    setCards: Card[],
    cards: BoxCard[]
};

type CheckListItem = {
    card: Card,
    has: boolean
}

const createChecklist = (setCards: Card[], boxCards: BoxCard[]) : CheckListItem[] =>
    setCards.map(c => ({
        card: c,
        has: boxCards.some(bc => bc.collectorsNumber === c.collector_number)
    }));

const CompletionCell = (props: { checkList: CheckListItem[] }) => {
    if (props.checkList.length === 0) {
        return <TableCell/>
    }

    const completion =
        props.checkList.filter(x => x.has).length
        / props.checkList.length
        * 100;

    return (
        <TableCell>
            <LinearProgress variant='determinate' value={completion}/>
            <Typography style={{ fontSize: ".75em" }}>
                {completion.toFixed(0)}%
            </Typography>
        </TableCell>
    );
};

const SetRow = (model: SetModel) => {
    const { set, setCards, cards } = model;

    // Combine foil/non-foil of same card
    const distinctCards = uniqBy(cards, c => c.collectorsNumber);

    const setCardsByRarity = groupBy(setCards, c => c.rarity);

    const all = createChecklist(setCards, cards);
    const mythics = createChecklist(setCardsByRarity['mythic'] ?? [], cards);
    const rares = createChecklist(setCardsByRarity['rare'] ?? [], cards);
    const uncommons = createChecklist(setCardsByRarity['uncommon'] ?? [], cards);
    const commons = createChecklist(setCardsByRarity['common'] ?? [], cards);

    return (
        <TableRow key={set.code}>
            <TableCell>
                {set.name} ({set.code.toUpperCase()})
            </TableCell>
            <TableCell align="right">
                {distinctCards.length} of {set.card_count}
            </TableCell>
            <CompletionCell checkList={all}/>
            <CompletionCell checkList={mythics}/>
            <CompletionCell checkList={rares}/>
            <CompletionCell checkList={uncommons}/>
            <CompletionCell checkList={commons}/>
        </TableRow>
    );
};

const SetCompletionReport = () => {
    const sets = useSelector(selectors.sets);
    const cardsBySet = useSelector(selectors.setsWithCards);

    const boxes = useSelector(selectors.boxes);
    const cards = getCardsFromBoxes(boxes);

    const getCardsOfSet = (set: string) => cards.filter(c => c.setAbbrev === set);

    const setsWithCards = sets
        .map(s => ({
            set: s,
            setCards: cardsBySet[s.code],
            cards: getCardsOfSet(s.code)
        }))
        .filter(x => x.cards.length > 0);

    const sorted = orderBy(setsWithCards, x => x.set.released_at);

    return (
        <TableContainer>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell width={2}>Set</TableCell>
                        <TableCell width={1}>Cards</TableCell>
                        <TableCell width={1}>Completion</TableCell>
                        <TableCell width={1}>M</TableCell>
                        <TableCell width={1}>R</TableCell>
                        <TableCell width={1}>U</TableCell>
                        <TableCell width={1}>C</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sorted.map(SetRow)}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export default SetCompletionReport;