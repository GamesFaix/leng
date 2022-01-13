import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { icons } from '../../fontawesome';
import { RootState } from '../../store';
import { SettingsActionTypes } from '../../store/settings';

const SettingsPage = () => {
    const oldSettings = useSelector((state: RootState) => state.settings.settings);
    const [newSettings, setNewSettings] = React.useState(oldSettings);

    const anyChanges = JSON.stringify(oldSettings) !== JSON.stringify(newSettings);

    const dispatch = useDispatch();

    function updateDataPath(path: string) {
        setNewSettings({
            ...newSettings,
            dataPath: path
        });
    }

    function save() {
        dispatch({
            type: SettingsActionTypes.Updated,
            settings: newSettings
        });
    }

    return (
        <div>
            <h2>Settings</h2>
            <form>
                <label>
                    Data path
                </label>
                <input
                    type="text"
                    value={newSettings?.dataPath ?? ''}
                    onChange={e => updateDataPath(e.target.value)}
                />
                <div>
                    <button
                        type="button"
                        disabled={!anyChanges}
                        onClick={() => save()}
                    >
                        Save
                    </button>
                    <button
                        type="button"
                        disabled={!anyChanges}
                    >
                        Cancel
                    </button>
                </div>
            </form>
            <Link to ="/">
                <button title="Home">
                    <FontAwesomeIcon icon={icons.home} />
                </button>
            </Link>
        </div>
    )
}
export default SettingsPage;