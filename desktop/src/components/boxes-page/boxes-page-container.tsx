import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { inventoryActions } from 'leng-core/src/store/inventory';
import { selectors } from "leng-core/src/store";
import BoxesPage from './boxes-page';

const BoxesPageContainer = () => {
    const boxes = useSelector(selectors.boxes);
    const dispatch = useDispatch();
    const [isNewBoxFormVisible, setIsNewBoxFormVisible] = React.useState(false);

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
export default BoxesPageContainer;