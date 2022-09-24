import * as React from 'react';
import { useSelector } from 'react-redux';
import selectors from '../../store/selectors';
import { getCardsFromBoxes } from '../../logic/card-filters';
import { LinearProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from '@mui/material';
import { orderBy, uniq } from 'lodash';
import { BoxCard } from '../../logic/model';
import { Set } from 'scryfall-api';

type SetModel = {
    set: Set,
    cards: BoxCard[]
};

const SetRow = (model: SetModel) => {
    const { set, cards } = model;

    const distinctCards = uniq(cards.map(x => x.collectorsNumber)).length;
    const completion = distinctCards / set.card_count * 100;

    return (
        <TableRow key={set.code}>
            <TableCell>{set.name} ({set.code.toUpperCase()})</TableCell>
            <TableCell align="right">{distinctCards} of {set.card_count}</TableCell>
            <TableCell>
                <LinearProgress variant='determinate' value={completion}/>
                <Typography style={{ fontSize: ".75em" }}>
                    {completion.toFixed(0)}%
                </Typography>
            </TableCell>
        </TableRow>
    );
};

const SetCompletionReport = () => {
    const sets = useSelector(selectors.sets);
    const boxes = useSelector(selectors.boxes);
    const cards = getCardsFromBoxes(boxes);

    const getCardsOfSet = (set: string) => cards.filter(c => c.setAbbrev === set);

    const setsWithCards = sets
        .map(s => { return { set: s, cards: getCardsOfSet(s.code) }; })
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
                    </TableRow>
                </TableHead>
                <TableBody>
                    {sorted.map(SetRow)}
                </TableBody>
            </Table>
        </TableContainer>
    )
}
export default SetCompletionReport;