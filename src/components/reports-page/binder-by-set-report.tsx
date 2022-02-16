import * as React from 'react';
import { BoxState } from '../../store/inventory';
import { chunk, Dictionary, groupBy, orderBy } from 'lodash';
import { useSelector } from 'react-redux';
import { Set } from 'scryfall-api';
import { innerJoin } from '../../logic/array-helper';
import { BoxCard } from '../../logic/model';
import selectors from '../../store/selectors';
import Binder from '../virtual-binder/binder';
import { getCardsFromBoxes } from '../../logic/card-filters';

type Props = {
    boxes: BoxState[]
}

type SetWithCards = {
    set: Set,
    cards: BoxCard[]
}

type SetWithCardGroups = {
    set: Set,
    cardGroups: BoxCard[][]
}

enum SetType {
    Normal,
    Tokens,
    Promos,
    ArtSeries
}

function getSetType(setName: string) : SetType {
    if (setName.endsWith(' Tokens')) return SetType.Tokens;
    if (setName.endsWith(' Promos')) return SetType.Promos;
    if (setName.endsWith(' Art Series')) return SetType.ArtSeries;
    return SetType.Normal;
}

function getSetBase(setName: string) : string {
    if (setName.endsWith(' Tokens')
    || setName.endsWith(' Promos')) {
        return setName.substring(0, setName.length - 7);
    }
    if (setName.endsWith(' Art Series')) {
        return setName.substring(0, setName.length - 11);
    }

    return setName;
}

function normalizeCollectorsNumber(x: string) {
    const pattern = /([a-zA-Z]*)(\d+)(.*)/
    const match = pattern.exec(x);
    const prefix = match![1];
    const num = match![2];
    const msc = match![3];
    return `${prefix.padEnd(1, "_")}|${num.toString().padStart(4, '0')}|${msc}`;
}

function compareCollectorsNumbers(a: string, b: string) : number {
    const normalizedA = normalizeCollectorsNumber(a);
    const normalizedB = normalizeCollectorsNumber(b);
    return normalizedA.localeCompare(normalizedB);
}

function organizePages(cards: BoxCard[], sets: Set[]) : BoxCard[][][] { // An array of pages, which are arrays of card groups, which are arrays of foil/non-foil versions of the same card
    const groupedBySet : Dictionary<BoxCard[]> = groupBy(cards, c => c.setAbbrev);

    const setsWithCards : SetWithCards[] = innerJoin(
        sets,
        Object.entries(groupedBySet),
        set => set.code,
        grp => grp[0],
        (set, grp) => { return { set, cards: grp[1] }; }
    );

    const setsWithSortedCardGroups : SetWithCardGroups[] =
        setsWithCards.map(x => {
            const groupById = groupBy(x.cards, c => c.scryfallId);
            const sorted = Object.values(groupById).sort((a, b) => compareCollectorsNumbers((a[0].collectorsNumber), (b[0].collectorsNumber)));
            return {
                set: x.set,
                cardGroups: sorted
            };
        })

    const groupSetsWithCardsBySetBase : Dictionary<SetWithCardGroups[]> =
        groupBy(setsWithSortedCardGroups, x => getSetBase(x.set.name));

    const relatedSetsWithCardGroups = Object.values(groupSetsWithCardsBySetBase)
        .map(grp => {
            const withTypes = grp.map(x => { return { ...x, type: getSetType(x.set.name)}; });
            const baseSet = withTypes.find(x => x.type === SetType.Normal);
            const tokenSet = withTypes.find(x => x.type === SetType.Tokens);
            const promosSet = withTypes.find(x => x.type === SetType.Promos);
            const artSeriesSet = withTypes.find(x => x.type === SetType.ArtSeries);

            const set = baseSet?.set ?? grp[0].set; // Some promo sets don't have a base set
            const cardGroups = (promosSet?.cardGroups ?? [])
                .concat(baseSet?.cardGroups ?? [])
                .concat(tokenSet?.cardGroups ?? [])
                .concat(artSeriesSet?.cardGroups ?? []);

            return { set, cardGroups };
        });

    const setsWithPages =
        relatedSetsWithCardGroups
            .map(x => { return { set: x.set, pages: chunk(x.cardGroups, 9)}; });

    const sortedSets =
        orderBy(setsWithPages, x => x.set.released_at);

    const pages = sortedSets
        .map(x => x.pages)
        .reduce((a,b) => a.concat(b), []);

    return pages;
}

const BinderBySetReport = (props: Props) => {
    const sets = useSelector(selectors.sets);
    const cards = getCardsFromBoxes(props.boxes);
    const pages = organizePages(cards, sets);
    return <Binder pages={pages}/>;
}
export default BinderBySetReport;