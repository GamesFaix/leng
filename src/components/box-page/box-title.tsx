import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { icons } from '../../fontawesome';
import { useStore } from '../../hooks';
import { renameBox } from '../../logic/inventoryController';

type Props = {
    name: string
}

type EditModeProps = {
    submit: (name: string) => void,
    cancel: () => void,
    oldName: string
}

function EditMode(props: EditModeProps) {
    const [newName, setNewName] = React.useState(props.oldName);

    return (<div style={{ display: 'flex' }}>
        <TextField
            title="New box name"
            value={newName}
            onChange={e => setNewName(e.target.value)}
        />
        <IconButton
            color='success'
            title="Submit"
            onClick={() => props.submit(newName)}
        >
            <FontAwesomeIcon icon={icons.ok}/>
        </IconButton>
        <IconButton
            color='error'
            title="Cancel"
            onClick={props.cancel}
        >
            <FontAwesomeIcon icon={icons.cancel}/>
        </IconButton>
    </div>);
}

type ReadModeProps = {
    name: string
    edit: () => void
}

function ReadMode(props: ReadModeProps) {
    return (<div style={{ display: 'flex' }}>
        <Typography variant="h3">
            {props.name}
        </Typography>
        <IconButton
            color='primary'
            title="Rename"
            onClick={props.edit}
        >
            <FontAwesomeIcon icon={icons.edit}/>
        </IconButton>
    </div>);
}

const BoxTitle = (props: Props) => {
    const [name, setName] = React.useState(props.name);
    const [isEditing, setIsEditing] = React.useState(false);
    const dispatch = useDispatch();
    const settings = useStore.settings();

    function rename(newName: string) {
        if (settings) {
            renameBox(settings, props.name, newName, dispatch)
                .then(() => {
                    setName(newName);
                    setIsEditing(false);
                })
                .catch(err => alert(err));
        }
    }

    return isEditing
        ? <EditMode
            oldName={name}
            submit={rename}
            cancel={() => setIsEditing(false)}
        />
        : <ReadMode
            name={name}
            edit={() => setIsEditing(true)}
        />;
}
export default BoxTitle;