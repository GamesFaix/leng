import { orderBy } from "lodash";
import { asyncRequest, AsyncRequest, AsyncRequestStatus, Box, BoxCard, BoxInfo, BoxTransferBulkRequest } from "../logic/model";

export type BoxState = {
    name: string,
    lastModified: Date,

    // Deferred loading because file must be opened and deserialized
    description: string | null,
    cards: BoxCard[] | null
}

export type InventoryState = {
    loading: boolean,
    boxes: BoxState[] | null,
}

const inventoryDefaultState : InventoryState = {
    boxes: null,
    loading: false
};

export enum InventoryActionTypes {
    BoxInfosLoad = 'INVENTORY_BOXINFOS_LOAD',
    BoxLoad = 'INVENTORY_BOX_LOAD',
    BoxSave = 'INVENTORY_BOX_SAVE',
    BoxCreate = 'INVENTORY_BOX_CREATE',
    BoxDelete = 'INVENTORY_BOX_DELETE',
    BoxRename = 'INVENTORY_BOX_RENAME',
    BoxTransferBulk = 'INVENTORY_BOX_TRANSFER_BULK',
    // TODO: Add single transfer action type, for moving only N copies of a specific card
}

export type BoxInfosLoadAction = {
    type: InventoryActionTypes.BoxInfosLoad,
    value: AsyncRequest<undefined, BoxInfo[]>
}

export type BoxLoadAction = {
    type: InventoryActionTypes.BoxLoad,
    value: AsyncRequest<string, Box>
}

export type BoxSaveAction = {
    type: InventoryActionTypes.BoxSave,
    value: AsyncRequest<Box, Box>
}

export type BoxCreateAction = {
    type: InventoryActionTypes.BoxCreate,
    value: AsyncRequest<string, Box>
}

export type BoxDeleteAction = {
    type: InventoryActionTypes.BoxDelete,
    value: AsyncRequest<string, string>
}

export type BoxRenameAction = {
    type: InventoryActionTypes.BoxRename,
    value: AsyncRequest<[string, string], [string, string]>
}

export type BoxTransferBulkAction = {
    type: InventoryActionTypes.BoxTransferBulk,
    value: AsyncRequest<BoxTransferBulkRequest, Box[]>
}

export const inventoryActions = {
    boxInfosLoadStart() : BoxInfosLoadAction {
        return {
            type: InventoryActionTypes.BoxInfosLoad,
            value: asyncRequest.started(undefined)
        };
    },
    boxInfosLoadSuccess(boxInfos: BoxInfo[]) : BoxInfosLoadAction {
        return {
            type: InventoryActionTypes.BoxInfosLoad,
            value: asyncRequest.success(boxInfos)
        };
    },
    boxInfosLoadFailure(error: string) : BoxInfosLoadAction {
        return {
            type: InventoryActionTypes.BoxInfosLoad,
            value: asyncRequest.failure(error)
        };
    },
    boxLoadStart(name: string) : BoxLoadAction {
        return {
            type: InventoryActionTypes.BoxLoad,
            value: asyncRequest.started(name)
        };
    },
    boxLoadSuccess(box: Box) : BoxLoadAction {
        return {
            type: InventoryActionTypes.BoxLoad,
            value: asyncRequest.success(box)
        };
    },
    boxLoadFailure(error: string) : BoxLoadAction {
        return {
            type: InventoryActionTypes.BoxLoad,
            value: asyncRequest.failure(error)
        };
    },
    boxSaveStart(box: Box) : BoxSaveAction {
        return {
            type: InventoryActionTypes.BoxSave,
            value: asyncRequest.started(box)
        };
    },
    boxSaveSuccess(box: Box) : BoxSaveAction {
        return {
            type: InventoryActionTypes.BoxSave,
            value: asyncRequest.success(box)
        };
    },
    boxSaveFailure(error: string) : BoxSaveAction {
        return {
            type: InventoryActionTypes.BoxSave,
            value: asyncRequest.failure(error)
        };
    },
    boxCreateStart(name: string) : BoxCreateAction {
        return {
            type: InventoryActionTypes.BoxCreate,
            value: asyncRequest.started(name)
        };
    },
    boxCreateSuccess(box: Box) : BoxCreateAction {
        return {
            type: InventoryActionTypes.BoxCreate,
            value: asyncRequest.success(box)
        };
    },
    boxCreateFailure(error: string) : BoxCreateAction {
        return {
            type: InventoryActionTypes.BoxCreate,
            value: asyncRequest.failure(error)
        };
    },
    boxDeleteStart(name: string) : BoxDeleteAction {
        return {
            type: InventoryActionTypes.BoxDelete,
            value: asyncRequest.started(name)
        };
    },
    boxDeleteSuccess(name: string) : BoxDeleteAction {
        return {
            type: InventoryActionTypes.BoxDelete,
            value: asyncRequest.success(name)
        };
    },
    boxDeleteFailure(error: string) : BoxDeleteAction {
        return {
            type: InventoryActionTypes.BoxDelete,
            value: asyncRequest.failure(error)
        };
    },
    boxRenameStart(oldName: string, newName: string) : BoxRenameAction {
        return {
            type: InventoryActionTypes.BoxRename,
            value: asyncRequest.started([oldName, newName])
        };
    },
    boxRenameSuccess(oldName: string, newName: string) : BoxRenameAction {
        return {
            type: InventoryActionTypes.BoxRename,
            value: asyncRequest.success([oldName, newName])
        };
    },
    boxRenameFailure(error: string) : BoxRenameAction {
        return {
            type: InventoryActionTypes.BoxRename,
            value: asyncRequest.failure(error)
        };
    },
    boxTransferBulkStart(request: BoxTransferBulkRequest) : BoxTransferBulkAction {
        return {
            type: InventoryActionTypes.BoxTransferBulk,
            value: asyncRequest.started(request)
        };
    },
    boxTransferBulkSuccess(updatedBoxes: Box[]) : BoxTransferBulkAction {
        return {
            type: InventoryActionTypes.BoxTransferBulk,
            value: asyncRequest.success(updatedBoxes)
        };
    },
    boxTransferBulkFailure(error: string) : BoxTransferBulkAction {
        return {
            type: InventoryActionTypes.BoxTransferBulk,
            value: asyncRequest.failure(error)
        };
    },
}

export type InventoryAction =
    BoxInfosLoadAction |
    BoxLoadAction |
    BoxSaveAction |
    BoxCreateAction |
    BoxDeleteAction |
    BoxRenameAction |
    BoxTransferBulkAction

export function inventoryReducer(state: InventoryState = inventoryDefaultState, action: InventoryAction): InventoryState {
    switch (action?.value?.status) {
        case AsyncRequestStatus.Started:
            return { ...state, loading: true };
        case AsyncRequestStatus.Failure:
            return { ...state, loading: false };
        case AsyncRequestStatus.Success: {
            switch (action.type) {
                case InventoryActionTypes.BoxInfosLoad: {
                    return {
                        ...state,
                        loading: false,
                        boxes: action.value.data.map(b => {
                            return {
                                name: b.name,
                                lastModified: b.lastModified,
                                description: null,
                                cards: null
                            };
                        })
                    };
                }
                case InventoryActionTypes.BoxLoad: {
                    const box = action.value.data as Box;
                    const boxes = state.boxes?.map(b => {
                        if (b.name === box.name) {
                            return { ...box };
                        } else {
                            return b;
                        }
                    }) ?? null;

                    return { ...state, boxes };
                }
                case InventoryActionTypes.BoxSave: {
                    const box = action.value.data as Box;
                    const boxes = state.boxes?.map(b => {
                        if (b.name === box.name) {
                            return box;
                        } else {
                            return b;
                        }
                    }) ?? null;
                    return { ...state, boxes };
                }
                case InventoryActionTypes.BoxCreate: {
                    const box = action.value.data as Box;
                    const newBox : BoxState = {
                        name: box.name,
                        lastModified: box.lastModified,
                        cards: [],
                        description: ''
                    };
                    const boxes = state.boxes ? orderBy([...state.boxes, newBox ], b => b.name) : null;
                    return { ...state, boxes };
                }
                case InventoryActionTypes.BoxDelete: {
                    const boxName = action.value.data as string;
                    const boxes = state.boxes?.filter(b => b.name !== boxName) ?? null;
                    return { ...state, boxes };
                }
                case InventoryActionTypes.BoxRename: {
                    if (!state.boxes) { return state; }
                    const [oldName, newName] = action.value.data as [string, string];
                    let boxes = state.boxes.map(b =>
                        b.name === oldName
                            ? { ...b, name: newName }
                            : b
                    );
                    boxes = orderBy(boxes, b => b.name);
                    return { ...state, boxes };
                }
                case InventoryActionTypes.BoxTransferBulk: {
                    const updatedBoxes = action.value.data;
                    const boxes = state.boxes?.map(b => {
                        const matchingUpdatedBox = updatedBoxes.find(ub => ub.name === b.name);
                        if (matchingUpdatedBox) {
                            return {
                                ...b,
                                cards: matchingUpdatedBox.cards,
                                lastModified: matchingUpdatedBox.lastModified
                            };
                        }
                        else {
                            return b;
                        }
                    }) ?? [];

                    return { ...state, boxes };
                }
                default:
                    return state;
            }
        }
        default:
            return state;
    }
}
