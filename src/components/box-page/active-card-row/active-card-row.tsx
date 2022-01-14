import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { CardName } from '../../../logic/model';
import { RootState } from '../../../store';
import { currentSelectionActions, CurrentSelectionState } from '../../../store/currentSelection';
import CardSearch from './card-search';
import SetSearch from './set-search';
import VersionPicker from './version-picker';

type Props = {

}

const ActiveCardRow = (props: Props) => {
    const dispatch = useDispatch();
    const cardNames : CardName[] = useSelector(
        (state: RootState) => state.encyclopedia.cardNames
    );
    const currentSelection: CurrentSelectionState = useSelector(
        (state: RootState) => state.currentSelection
    );

    return (<tr key="active-row">
        <td>
            (Count field)
        </td>
        <td>
            <CardSearch
                encyclopediaCards={cardNames}
                onCardSelected={name => {
                    if (name === null) {
                        dispatch(currentSelectionActions.clear());
                    }
                    else {
                        const selection = cardNames.find(c => c.name === name);
                        dispatch(currentSelectionActions.selectCardName(selection));
                    }
                }}
            />
        </td>
        <td>
            <SetSearch
                selectedCard={currentSelection.cardName}
                onSetSelected={abbrev => {
                    dispatch(currentSelectionActions.selectSetAbbrev(abbrev))
                }}
            />
        </td>
        <td>
            <VersionPicker
                cardName={currentSelection.cardName}
                setAbbrev={currentSelection.setAbbrev}
                onVersionPicked={(scryfallId, isFoil) => dispatch(currentSelectionActions.selectVersion(scryfallId, isFoil))}
            />
        </td>
        <td>
            (foil)
        </td>
        <td>
            (save)
            (cancel)
        </td>
    </tr>);
}
export default ActiveCardRow;