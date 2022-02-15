export type EditingState = {
    unsavedChanges: boolean
}

const defaultEditingState : EditingState = {
    unsavedChanges: false
}

export enum EditingActionTypes {
    Edit = 'EDITING_EDIT',
    Save = 'EDITING_SAVE',
    Reset = 'EDITING_RESET'
}

export type EditingAction = {
    type: EditingActionTypes
}

export const editingActions = {
    edit(): EditingAction {
        return {
            type: EditingActionTypes.Edit
        };
    },
    save(): EditingAction {
        return {
            type: EditingActionTypes.Save
        };
    },
    reset(): EditingAction {
        return {
            type: EditingActionTypes.Reset
        }
    }
}

export function editingReducer(state: EditingState = defaultEditingState, action: EditingAction) : EditingState {
    switch (action.type) {
        case EditingActionTypes.Edit:
            return {
                ...state,
                unsavedChanges: true
            };
        case EditingActionTypes.Save:
            return {
                ...state,
                unsavedChanges: false
            };
        case EditingActionTypes.Reset:
            return {
                ...state,
                unsavedChanges: false
            }
        default:
            return state;
    }
}