import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import moment = require('moment');
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { icons } from '../../fontawesome';
import { createBox, deleteBox, getBoxInfos } from '../../logic/inventoryController';
import { RootState } from '../../store';
import { BoxState, InventoryActionTypes } from '../../store/inventory';

type BoxesTableProps = {
    boxes: BoxState[],
    deleteBox: (name:string) => void
}

const BoxesTable = (props: BoxesTableProps) => {
    return (<table>
        <tbody>
            {props.boxes.map(b =>
                <tr key={b.name}>
                    <td>
                        <Link to={`/boxes/${b.name}`}>
                            <button>
                                {b.name}
                            </button>
                        </Link>
                    </td>
                    <td>
                        {moment(b.lastModified).calendar()}
                    </td>
                    <td>
                        <button
                            title="Delete box"
                            onClick={() => props.deleteBox(b.name)}
                        >
                            <FontAwesomeIcon icon={icons.delete}/>
                        </button>
                    </td>
                </tr>
            )}
        </tbody>
    </table>)
}

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