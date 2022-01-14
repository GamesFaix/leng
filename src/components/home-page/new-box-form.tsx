import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { icons } from '../../fontawesome';
import { createBox } from '../../logic/inventoryController';
import { RootState } from '../../store';

type Props = {
    close: () => void
}

const NewBoxForm = (props: Props) => {
    const settings = useSelector((state: RootState) => state.settings.settings);
    const dispatch = useDispatch();
    const [newBoxName, setNewBoxName] = React.useState('');

    const disableButton = settings === null;

    return (<div>
        <input
            type="text"
            onChange={e => setNewBoxName(e.target.value)}
            value={newBoxName}
            placeholder="Enter box name..."
        />
        <button
            disabled={disableButton}
            type="button"
            title="Create box"
            onClick={() => {
                createBox(settings!, newBoxName, dispatch);
                props.close();
            }}
        >
            <FontAwesomeIcon icon={icons.ok} />
        </button>
        <button
            type="button"
            title="Cancel"
            onClick={() => props.close()}
        >
            <FontAwesomeIcon icon={icons.cancel} />
        </button>
    </div>);
};
export default NewBoxForm;
