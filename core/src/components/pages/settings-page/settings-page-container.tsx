import { useDispatch, useSelector } from "react-redux";
import { selectors } from "../../../store";
import { settingsActions } from "../../../store/settings";
import SettingsPage from "./settings-page";
import { useState } from "react";

export const SettingsPageContainer = () => {
  const oldSettings = useSelector(selectors.settings);
  const [newSettings, setNewSettings] = useState(oldSettings);

  const anyChanges =
    JSON.stringify(oldSettings) !== JSON.stringify(newSettings);

  const dispatch = useDispatch();

  function updateDataPath(path: string) {
    setNewSettings({
      ...newSettings,
      dataPath: path,
    });
  }

  function save() {
    dispatch(settingsActions.saveStart(newSettings));
  }

  return (
    <SettingsPage
      dataPath={newSettings.dataPath ?? ""}
      setDataPath={updateDataPath}
      anyChanges={anyChanges}
      save={save}
    />
  );
};
