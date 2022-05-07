import * as React from 'react';
import { CardFilter } from '../../logic/model';
import { getCards } from '../../logic/card-filters';
import { ColorFilterRule } from '../collection-page/color-rule-selector';
import CardsTable from '../collection-page/cards-table';
import { useSelector } from 'react-redux';
import selectors from '../../store/selectors';

const MissingFromBinderReport = () => {
    const boxes = useSelector(selectors.boxes);
    const boxNames = boxes.map(b => b.name);
    const sets = useSelector(selectors.sets);

    const setTypes = [
        'core',
        'expansion',
        'funny',
        'starter',
        'box'
    ];
    const setAbbrevs = sets
        .filter(s => setTypes.includes(s.set_type)
            && s.released_at && s.released_at <= '2009-05-01' // Day after Alara Reborn release
        )
        .map(s => s.code);

    const fromBoxes = boxNames.filter(b => b.startsWith("Bulk") || b.startsWith("Bundle"));
    const exceptBoxes = boxNames.filter(b => b.startsWith("Binder"));

    const filter : CardFilter = {
        nameQuery: '',
        colors: [],
        colorRule: ColorFilterRule.IdentityContainsOnly,
        setAbbrevs,
        fromBoxes,
        exceptBoxes,
        format: null
    }

    const cards = getCards(boxes, filter);

    return <CardsTable cards={cards} />;
}
export default MissingFromBinderReport;