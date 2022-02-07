import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { inventoryActions } from '../../store/inventory';
import BoxesPage from './boxes-page';

const BoxesPageContainer = () => {
    const boxes = useSelector((state: RootState) => state.inventory.boxes);
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