
import { IconProp, library } from "@fortawesome/fontawesome-svg-core";
import { faCheck, faCog, faHome, faPencilAlt, faPlus, faTrash, faWindowClose } from '@fortawesome/free-solid-svg-icons';

library.add(faCheck, faCog, faHome, faPlus, faTrash, faWindowClose);

export const icons = {
    home: <IconProp>'home',
    add: <IconProp>'plus',
    settings: <IconProp>'cog',
    ok: <IconProp>'check',
    cancel: <IconProp>'window-close',
    delete: <IconProp>'trash',
    edit: <IconProp>'pencil-alt'
};