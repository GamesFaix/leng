import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { inventoryActions } from '../../store/inventory';
import LoadingMessage from '../common/loading-message';
import BoxesPage from './boxes-page';

const BoxesPageContainer = () => {
    const settings = useSelector((state: RootState) => state.settings.settings);
    const boxes = useSelector((state: RootState) => state.inventory.boxes);
    const dispatch = useDispatch();
    const [isNewBoxFormVisible, setIsNewBoxFormVisible] = React.useState(false);

    React.useEffect(() => {
        if (settings !== null && boxes === null) {
            dispatch(inventoryActions.boxInfosLoadStart());
        }
    });

    function deleteBox(name: string) {
        dispatch(inventoryActions.boxDeleteStart(name));
    }

    if (!settings || !boxes) {
        return <LoadingMessage message="Loading box info..."/>;
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