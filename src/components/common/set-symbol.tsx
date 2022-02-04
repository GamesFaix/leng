import { Icon } from '@mui/material';
import * as React from 'react';
import { useStore } from '../../hooks';
import { getSetSymbolImagePath } from '../../sagas/encyclopedia';

type Props = {
    setAbbrev: string
}

const SetSymbol = (props: Props) => {
    const settings = useStore.settings();

    const url = getSetSymbolImagePath(settings!, props.setAbbrev);

    return (
        <Icon>
            <img src={url}/>
        </Icon>
    );
}
export default SetSymbol;