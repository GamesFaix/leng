import { AppSettings, asyncRequest, AsyncRequest, AsyncRequestStatus } from "leng-core/src/logic/model"

export type SettingsState = {
    settings: AppSettings | null
    isLoading: boolean,
}

const settingsDefaultState : SettingsState = {
    settings: null,
    isLoading: false,
}

export enum SettingsActionTypes {
    Load = 'SETTINGS_LOAD',
    Save = 'SETTINGS_SAVE',
}

export type SettingsLoadAction = {
    type: SettingsActionTypes.Load,
    value: AsyncRequest<void, AppSettings>
}

export type SettingsSaveAction = {
    type: SettingsActionTypes.Save,
    value: AsyncRequest<AppSettings, AppSettings>
}

export type SettingsAction =
    SettingsLoadAction |
    SettingsSaveAction

export const settingsActions = {
    loadStart() : SettingsLoadAction {
        return {
            type: SettingsActionTypes.Load,
            value: asyncRequest.started(undefined)
        }
    },
    loadSuccess(data: AppSettings) : SettingsLoadAction {
        return {
            type: SettingsActionTypes.Load,
            value: asyncRequest.success(data)
        }
    },
    loadError(error: string) : SettingsLoadAction {
        return {
            type: SettingsActionTypes.Load,
            value: asyncRequest.failure(error)
        }
    },
    saveStart(data: AppSettings) : SettingsSaveAction {
        return {
            type: SettingsActionTypes.Save,
            value: asyncRequest.started(data)
        }
    },
    saveSuccess(data: AppSettings) : SettingsSaveAction {
        return {
            type: SettingsActionTypes.Save,
            value: asyncRequest.success(data)
        }
    },
    saveError(error: string) : SettingsSaveAction {
        return {
            type: SettingsActionTypes.Save,
            value: asyncRequest.failure(error)
        }
    }
}

export function settingsReducer(state: SettingsState = settingsDefaultState, action: SettingsAction) : SettingsState {
    switch (action.type) {
        case SettingsActionTypes.Load: {
            const req = (action as SettingsLoadAction).value
            switch (req.status) {
                case AsyncRequestStatus.Started:
                    return {
                        ...state,
                        isLoading: true
                    };
                case AsyncRequestStatus.Success:
                    return {
                        ...state,
                        settings: req.data,
                        isLoading: false
                    };
                case AsyncRequestStatus.Failure:
                    return {
                        ...state,
                        isLoading: false
                    };
                default:
                    return state;
            }
        }
        case SettingsActionTypes.Save: {
            const req = (action as SettingsSaveAction).value
            switch (req.status) {
                case AsyncRequestStatus.Started:
                    return {
                        ...state,
                        isLoading: true
                    };
                case AsyncRequestStatus.Success:
                    return {
                        ...state,
                        settings: req.data,
                        isLoading: false
                    };
                case AsyncRequestStatus.Failure:
                    return {
                        ...state,
                        isLoading: false
                    };
                default:
                    return state;
            }
        }
        default:
            return state;
    }
}
