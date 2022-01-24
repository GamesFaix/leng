import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { icons } from '../../fontawesome';
import { deleteBox, getBoxInfos } from '../../logic/inventoryController';
import { RootState } from '../../store';
import { InventoryActionTypes } from '../../store/inventory';
import IconButton from '../common/icon-button';
import BoxesTable from './boxes-table';
import NewBoxForm from './new-box-form';

const HomePage = () => {
    const settings = useSelector((state: RootState) => state.settings.settings);
    const boxes = useSelector((state: RootState) => state.inventory.boxes);
    const dispatch = useDispatch();
    const [isNewBoxFormVisible, setIsNewBoxFormVisible] = React.useState(false);

    const hideBoxesTable = settings === null || boxes === null;

    React.useEffect(() => {
        if (settings !== null && boxes === null) {
            dispatch({ type: InventoryActionTypes.LoadBoxInfosStart });
            getBoxInfos(settings)
                .then(boxInfos => {
                    dispatch({
                        type: InventoryActionTypes.LoadBoxInfosSuccess,
                        boxes: boxInfos
                    });
                });
        }
    });

    return (
        <div>
            <h2>Home</h2>
            <br/>
            <IconButton
                title="Add box"
                onClick={() => setIsNewBoxFormVisible(true)}
                icon={icons.add}
                variant='outlined'
                color='secondary'
            />
            <Link to="/settings">
                <IconButton
                    title="Settings"
                    icon={icons.settings}
                    variant='outlined'
                    color='secondary'
                />
            </Link>
            <br/>
            <br/>
            {isNewBoxFormVisible
                ? (<>
                    <NewBoxForm close={() => setIsNewBoxFormVisible(false)}/>
                    <br/>
                </>)
                : ""
            }
            <h3>Your boxes:</h3>
            <div className="boxes-area">
                {hideBoxesTable
                    ? "Loading box info..."
                    : (<BoxesTable
                        boxes={boxes}
                        deleteBox={name => deleteBox(settings, name, dispatch)}
                    />)
                }
            </div>
        </div>
    );
};
export default HomePage;