import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, TextField } from '@mui/material';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { icons } from '../../fontawesome';
import { RootState } from '../../store';
import { inventoryActions } from '../../store/inventory';

type Props = {
    close: () => void
}

const NewBoxForm = (props: Props) => {
    const settings = useSelector((state: RootState) => state.settings.settings);
    const dispatch = useDispatch();
    const [newBoxName, setNewBoxName] = React.useState('');

    const disableButton = settings === null;

    function submit() {
        dispatch(inventoryActions.boxCreateStart(newBoxName));
        props.close();
    }

    return (<div>
        <TextField
            onChange={e => setNewBoxName(e.target.value)}
            value={newBoxName}
            placeholder="Enter box name..."
        />
        <IconButton
            disabled={disableButton}
            title="Create box"
            onClick={submit}
            color='success'
        >
            <FontAwesomeIcon icon={icons.ok}/>
        </IconButton>
        <IconButton
            title="Cancel"
            onClick={() => props.close()}
            color='error'
        >
            <FontAwesomeIcon icon={icons.cancel}/>
        </IconButton>
    </div>);
};
export default NewBoxForm;
