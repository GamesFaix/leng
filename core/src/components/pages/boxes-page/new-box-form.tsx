import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, TextField } from '@mui/material';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { icons } from '../../../ui/fontawesome';
import { inventoryActions } from '../../../store/inventory';

type Props = {
    close: () => void
}

const NewBoxForm = (props: Props) => {
    const dispatch = useDispatch();
    const [newBoxName, setNewBoxName] = React.useState('');

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
