
import { IconProp, library } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faCog, faHome, faBoxOpen, faPencilAlt, faPlus, faSave, faTrash, faWindowClose } from '@fortawesome/free-solid-svg-icons';

library.add(faBoxOpen, faCheck, faCog, faHome, faPencilAlt, faPlus, faSave, faTrash, faWindowClose);

export const icons = {
    home: <IconProp>'home',
    add: <IconProp>'plus',
    settings: <IconProp>'cog',
    ok: <IconProp>'check',
    cancel: <IconProp>'window-close',
    delete: <IconProp>'trash',
    edit: <IconProp>'pencil-alt',
    save: <IconProp>'save',
    open: <IconProp>'box-open'
};