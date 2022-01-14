import * as React from 'react';
import CardSearch from './card-search';
import SetSearch from './set-search';
import VersionPicker from './version-picker';

type Props = {

}

const ActiveCardRow = (props: Props) => {
    return (<tr key="active-row">
        <td>
            (Count field)
        </td>
        <td>
            <CardSearch />
        </td>
        <td>
            <SetSearch />
        </td>
        <td>
            <VersionPicker />
        </td>
        <td>
            (foil)
        </td>
        <td>
            (save)
            (cancel)
        </td>
    </tr>);
}
export default ActiveCardRow;