import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton } from '@mui/material';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { icons } from '../../fontawesome';

type Props = {
    dataPath: string,
    setDataPath: (path: string) => void
    anyChanges: boolean,
    save: () => void
}

const SettingsPage = (props: Props) => {
    return (
        <div>
            <h2>Settings</h2>
            <form>
                <label className="form-label">
                    Data path
                </label>
                <input
                    type="text"
                    value={props.dataPath}
                    onChange={e => props.setDataPath(e.target.value)}
                />
                <br/>
                <div>
                    <button
                        type="button"
                        disabled={!props.anyChanges}
                        onClick={props.save}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        disabled={!props.anyChanges}
                    >
                        Cancel
                    </button>
                </div>
            </form>
            <br/>
            <Link to ="/">
                <IconButton
                    title="Home"
                    color='primary'
                >
                    <FontAwesomeIcon icon={icons.home}/>
                </IconButton>
            </Link>
        </div>
    )
}
export default SettingsPage;