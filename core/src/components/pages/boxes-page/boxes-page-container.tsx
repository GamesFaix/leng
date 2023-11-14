import { useDispatch, useSelector } from 'react-redux';
import { inventoryActions } from '../../../store/inventory';
import { selectors } from "../../../store";
import BoxesPage from './boxes-page';
import { useState } from 'react';

export const BoxesPageContainer = () => {
    const boxes = useSelector(selectors.boxes);
    const dispatch = useDispatch();
    const [isNewBoxFormVisible, setIsNewBoxFormVisible] = useState(false);

    function deleteBox(name: string) {
        dispatch(inventoryActions.boxDeleteStart(name));
    }

    return (
        <BoxesPage
            boxes={boxes ?? []}
            isNewBoxFormVisible={isNewBoxFormVisible}
            setIsNewBoxFormVisible={setIsNewBoxFormVisible}
            delete={deleteBox}
        />
    );
};