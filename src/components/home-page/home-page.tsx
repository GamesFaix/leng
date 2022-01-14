import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { icons } from '../../fontawesome';
import { getBoxInfos } from '../../logic/inventoryController';
import { RootState } from '../../store';
import { BoxState, InventoryActionTypes } from '../../store/inventory';

const HomePage = () => {
    const settings = useSelector((state: RootState) => state.settings.settings);
    const boxes = useSelector((state: RootState) => state.inventory.boxes);
    const dispatch = useDispatch();

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

    function boxLink(box: BoxState) {
        return (
            <Link to={`/boxes/${box.name}`}>
                <button>
                    {box.name}
                </button>
            </Link>
        );
    }

    const boxLinks =
        boxes === null
        ? "Loading box info..."
        : boxes.map(boxLink);

    return (
        <div>
            <h2>Home</h2>
            <br/>
            {boxLinks}
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