export type EditingState = {
    unsavedChanges: boolean
}

const defaultEditingState : EditingState = {
    unsavedChanges: false
}

export enum EditingActionTypes {
    Edit = 'EDITING_EDIT',
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
        case EditingActionTypes.Reset:
            return {
                ...state,
                unsavedChanges: false
            }
        default:
            return state;
    }
}