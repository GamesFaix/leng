import { AppSettings } from '../logic/settings-controller';

export type SettingsState = {
    settings: AppSettings | null
    isLoading: boolean,
}

const settingsDefaultState : SettingsState = {
    settings: null,
    isLoading: false,
}

export enum SettingsActionTypes {
    LoadStart = 'LOAD_SETTINGS_START',
    LoadSuccess = 'LOAD_SETTINGS_SUCCESS',
    Updated = 'SETTINGS_UPDATED'
}

export type LoadSettingsStartAction = {
    type: SettingsActionTypes.LoadStart
}

export type LoadSettingsSuccessAction = {
    type: SettingsActionTypes.LoadSuccess,
    settings: AppSettings
}

export type SettingsUpdatedAction = {
    type: SettingsActionTypes.Updated,
    settings: AppSettings
}

export type SettingsAction =
    LoadSettingsStartAction |
    LoadSettingsSuccessAction |
    SettingsUpdatedAction

export function settingsReducer(state: SettingsState = settingsDefaultState, action: SettingsAction) : SettingsState {
    switch (action.type) {
        case SettingsActionTypes.LoadStart:
            return {
                ...state,
                isLoading: true
            };
        case SettingsActionTypes.LoadSuccess:
            return {
                ...state,
                isLoading: false,
                settings: action.settings
            };
        case SettingsActionTypes.Updated:
            return {
                ...state,
                settings: action.settings
            };
        default:
            return state;
    }
}
