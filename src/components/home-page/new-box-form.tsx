import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { icons } from '../../fontawesome';
import { createBox } from '../../logic/inventoryController';
import { RootState } from '../../store';
import IconButton from '../common/icon-button';

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
        <IconButton
            disabled={disableButton}
            title="Create box"
            onClick={() => {
                createBox(settings!, newBoxName, dispatch);
                props.close();
            }}
            icon={icons.ok}
            variant='contained'
            color='success'
        />
        <IconButton
            title="Cancel"
            onClick={() => props.close()}
            icon={icons.cancel}
            variant='outlined'
            color='error'
        />
    </div>);
};
export default NewBoxForm;
