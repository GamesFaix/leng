import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { icons } from '../../fontawesome';
import { saveSettings } from '../../logic/settings-controller';
import { RootState } from '../../store';

const SettingsPage = () => {
    const oldSettings = useSelector((state: RootState) => state.settings.settings) ?? { dataPath: '' };
    const [newSettings, setNewSettings] = React.useState(oldSettings);

    const anyChanges = JSON.stringify(oldSettings) !== JSON.stringify(newSettings);

    const dispatch = useDispatch();

    function updateDataPath(path: string) {
        setNewSettings({
            ...newSettings,
            dataPath: path
        });
    }

    return (
        <div>
            <h2>Settings</h2>
            <form>
                <label className="form-label">
                    Data path
                </label>
                <input
                    type="text"
                    value={newSettings?.dataPath ?? ''}
                    onChange={e => updateDataPath(e.target.value)}
                />
                <br/>
                <div>
                    <button
                        type="button"
                        disabled={!anyChanges}
                        onClick={() => saveSettings(newSettings, dispatch)}
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
            <br/>
            <Link to ="/">
                <button title="Home">
                    <FontAwesomeIcon icon={icons.home} />
                </button>
            </Link>
        </div>
    )
}
export default SettingsPage;