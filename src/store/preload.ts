export type PreloadState = {
    ready: boolean,
    message: string
}

const defaultPreloadState : PreloadState = {
    ready: false,
    message: ''
}

export enum PreloadActionTypes {
    Start = "PRELOAD_START",
    Update = "PRELOAD_UPDATE",
    Finish = "PRELOAD_FINISH"
}

export type PreloadStartAction = {
    type: PreloadActionTypes.Start
}

export type PreloadUpdateAction = {
    type: PreloadActionTypes.Update,
    message: string
}

export type PreloadFinishAction = {
    type: PreloadActionTypes.Finish
}

export type PreloadAction =
    PreloadStartAction |
    PreloadUpdateAction |
    PreloadFinishAction

export const preloadActions = {
    start() : PreloadStartAction {
        return {
            type: PreloadActionTypes.Start
        };
    },
    update(message: string) : PreloadUpdateAction {
        return {
            type: PreloadActionTypes.Update,
            message
        };
    },
    finish() : PreloadFinishAction {
        return {
            type: PreloadActionTypes.Finish
        };
    }
}

export function preloadReducer(state: PreloadState = defaultPreloadState, action: PreloadAction) {
    switch (action.type) {
        case PreloadActionTypes.Start:
            return {
                ready: false,
                message: 'Starting preload...'
            };
        case PreloadActionTypes.Update:
            return {
                ready: false,
                message: action.message
            };
        case PreloadActionTypes.Finish:
            return {
                ready: true,
                message: ''
            };
        default:
            return state;
    }
}