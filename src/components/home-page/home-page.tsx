import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { icons } from '../../fontawesome';
import { createBox, deleteBox, getBoxInfos } from '../../logic/inventoryController';
import { RootState } from '../../store';
import { InventoryActionTypes } from '../../store/inventory';
import BoxesTable from './boxes-table';

const HomePage = () => {
    const settings = useSelector((state: RootState) => state.settings.settings);
    const boxes = useSelector((state: RootState) => state.inventory.boxes);
    const dispatch = useDispatch();
    const [isNewBoxFormVisible, setIsNewBoxFormVisible] = React.useState(false);
    const [newBoxName, setNewBoxName] = React.useState('');

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

    function showNewBoxForm() {
        setIsNewBoxFormVisible(true);
        setNewBoxName('');
    }

    function hideNewBoxForm() {
        setIsNewBoxFormVisible(false);
        setNewBoxName('');
    }

    function createNewBox() {
        createBox(settings, newBoxName, dispatch);
        hideNewBoxForm();
    }

    function deleteBox1(name: string) {
        deleteBox(settings, name, dispatch);
    }

    const boxLinks =
        boxes === null
        ? "Loading box info..."
        : (<BoxesTable
            boxes={boxes}
            deleteBox={deleteBox1}
        />);

    const newBoxForm =
        isNewBoxFormVisible
        ? (<>
            <div>
                <input
                    type="text"
                    onChange={e => setNewBoxName(e.target.value)}
                    value={newBoxName}
                    placeholder="Enter box name..."
                />
                <button
                    type="button"
                    title="Create box"
                    onClick={() => createNewBox()}
                >
                    <FontAwesomeIcon icon={icons.ok} />
                </button>
                <button
                    type="button"
                    title="Cancel"
                    onClick={() => hideNewBoxForm()}
                >
                    <FontAwesomeIcon icon={icons.cancel} />
                </button>
            </div>
            <br/>
        </>)
        : "";

    return (
        <div>
            <h2>Home</h2>
            <br/>
            <button title="Add box"
                onClick={() => showNewBoxForm()}
            >
                <FontAwesomeIcon icon={icons.add} />
            </button>
            <br/>
            {newBoxForm}
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