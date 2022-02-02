import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, TextField, Typography } from '@mui/material';
import * as React from 'react';
import { useDispatch } from 'react-redux';
import { icons } from '../../fontawesome';
import { useStore } from '../../hooks';
import { inventoryActions } from '../../store/inventory';

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
    const [oldName, setOldName] = React.useState(props.name);
    const [newName, setNewName] = React.useState<string | null>(null);
    const [isEditing, setIsEditing] = React.useState(false);
    const dispatch = useDispatch();
    const oldBox = useStore.box(oldName);
    const newBox = useStore.box(newName);

    function renameStart(newName: string) {
        dispatch(inventoryActions.boxRenameStart(props.name, newName));
        setNewName(newName);
    }

    function renameFinish() {
        setOldName(newName!);
        setIsEditing(false);
        setNewName(null);
    }

    React.useLayoutEffect(() => {
        if (newBox && !oldBox) {
            renameFinish();
        }
    });

    return isEditing
        ? <EditMode
            oldName={oldName}
            submit={renameStart}
            cancel={() => setIsEditing(false)}
        />
        : <ReadMode
            name={oldName}
            edit={() => setIsEditing(true)}
        />;
}
export default BoxTitle;