import { Card, IconButton, Typography } from '@mui/material';
import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from '../../fontawesome';
import { useNavigate } from 'react-router-dom';
import { BoxCard, CardFilter } from '../../logic/model';
import { getCards } from '../../logic/card-filters';
import { ColorFilterRule } from '../collection-page/color-rule-selector';
import CardsTable from '../collection-page/cards-table';
import { useSelector } from 'react-redux';
import selectors from '../../store/selectors';

function getCount(cards: BoxCard[]) : number {
    return cards.map(c => c.count).reduce((a,b) => a+b, 0);
}

const ReportsPage = () => {
    const navigate = useNavigate();

    const filter : CardFilter = {
        nameQuery: '',
        colors: [],
        colorRule: ColorFilterRule.IdentityContainsOnly,
        setAbbrevs: [
            // Binder 1
            "atq","leg","drk","fem",
            "ice","hml","all",
            "mir","vis",
            "3ed","4ed","chr","5ed",

            // Binder 2
            "wth",
            "tmp","sth","exo",
            "usg","ulg","uds",
            "mmq","nem","pcy",
            "6ed",

            // Binder 3
            "inv","pls","apc",
            "ody","tor","jud",
            "ons","lgn","scg",
            "7ed",

            // Binder 4
            "8ed","9ed","10e",
            "mrd","dst","5dn",
            "chk","bok","sok",
            "eve","mor","lrw","shm",
            "rav","dis","gpt",
            "csp",
            "ala",/*"con",*/"arb",
            "tsp","plc","fut",
            "ath","brb","dkm",
            "por","p02","ptk","s99","s00",
            "ugl","unh"
        ],
        fromBoxes: [
            "Bulk 1 (W, U creatures)",
            "Bulk 2 (B, C)",
            "Bulk 3 (R, Basic land, misc)",
            "Bulk 4 (G, 2-color, 3-color)",
            "Bulk 5 (U non-creature, 5-color)",
            "Bundle - Dominaria (Temp)"
        ],
        exceptBoxes: [
            "Binder 1 (Alpha-5ED)",
            "Binder 2 (Weatherlight - Prophecy)",
            "Binder 3 (Invasion - Scourge)",
            "Binder 4 (8ED - Alara, misc)"
        ]
    }

    const boxes = useSelector(selectors.boxes);
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
            <Card sx={{ width: 900, padding: 1 }}>
                <CardsTable
                    cards={cards}
                />
            </Card>
        </div>
    );
}
export default ReportsPage;