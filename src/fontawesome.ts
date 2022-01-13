
import { IconProp, library } from "@fortawesome/fontawesome-svg-core";
import { faCog, faHome } from '@fortawesome/free-solid-svg-icons';

library.add(faCog, faHome);

export const icons = {
    home: <IconProp>'home',
    settings: <IconProp>'cog',
};