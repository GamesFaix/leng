import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import { settingsActions } from '../../store/settings';
import SettingsPage from './settings-page';

const SettingsPageContainer = () => {
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

    function save() {
        dispatch(settingsActions.saveStart(newSettings));
    }

    return (
        <SettingsPage
            dataPath={newSettings.dataPath ?? ''}
            setDataPath={updateDataPath}
            anyChanges={anyChanges}
            save={save}
        />
    );
}
export default SettingsPageContainer;