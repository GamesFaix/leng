import * as React from 'react';
import { Typography } from '@mui/material';

type Props = {
    dataPath: string,
    setDataPath: (path: string) => void
    anyChanges: boolean,
    save: () => void
}

const SettingsPage = (props: Props) => {
    return (
        <div>
            <Typography variant="h4">
                Settings
            </Typography>
            <br/>
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
        </div>
    )
}
export default SettingsPage;