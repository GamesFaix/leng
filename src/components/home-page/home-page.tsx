import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { icons } from '../../fontawesome';
import { deleteBox, getBoxInfos } from '../../logic/inventoryController';
import { RootState } from '../../store';
import { InventoryActionTypes } from '../../store/inventory';
import BoxesTable from './boxes-table';
import NewBoxForm from './new-box-form';

const HomePage = () => {
    const settings = useSelector((state: RootState) => state.settings.settings);
    const boxes = useSelector((state: RootState) => state.inventory.boxes);
    const dispatch = useDispatch();
    const [isNewBoxFormVisible, setIsNewBoxFormVisible] = React.useState(false);

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
            <button
                title="Add box"
                onClick={() => setIsNewBoxFormVisible(true)}
            >
                <FontAwesomeIcon icon={icons.add} />
            </button>
            <br/>
            <br/>
            {isNewBoxFormVisible
                ? (<>
                    <NewBoxForm close={() => setIsNewBoxFormVisible(false)}/>
                    <br/>
                </>)
                : ""
            }
            {boxes === null
                ? "Loading box info..."
                : (<BoxesTable
                    boxes={boxes}
                    deleteBox={name => deleteBox(settings, name, dispatch)}
                />)
            }
            <br/>
            <Link to="/settings">
                <button title="Settings">
                    <FontAwesomeIcon icon={icons.settings} />
                </button>
            </Link>
        </div>
    );
};
export default HomePage;