
import { IconProp, library } from "@fortawesome/fontawesome-svg-core";
import {
    faBox,
    faBoxOpen,
    faCaretDown,
    faCaretUp,
    faCheck,
    faCog,
    faFile,
    faFileExport,
    faHome,
    faIdBadge,
    faLayerGroup,
    faPalette,
    faPencilAlt,
    faPlus,
    faSave,
    faSearchPlus,
    faTrash,
    faWindowClose,
} from '@fortawesome/free-solid-svg-icons';

library.add(
    faBox,
    faBoxOpen,
    faCaretDown,
    faCaretUp,
    faCheck,
    faCog,
    faFile,
    faFileExport,
    faHome,
    faIdBadge,
    faLayerGroup,
    faPalette,
    faPencilAlt,
    faPlus,
    faSave,
    faSearchPlus,
    faTrash,
    faWindowClose,
);

export const icons = {
    home: <IconProp>'home',
    add: <IconProp>'plus',
    settings: <IconProp>'cog',
    ok: <IconProp>'check',
    cancel: <IconProp>'window-close',
    delete: <IconProp>'trash',
    edit: <IconProp>'pencil-alt',
    save: <IconProp>'save',
    open: <IconProp>'box-open',
    inspect: <IconProp>'search-plus',
    badge: <IconProp>'id-badge',
    art: <IconProp>'palette',
    collection: <IconProp>'layer-group',
    report: <IconProp>'file',
    box: <IconProp>'box',
    export: <IconProp>'file-export',
    collapseArea: <IconProp>'caret-up',
    expandArea: <IconProp>'caret-down'
};