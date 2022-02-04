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
        <Icon
            sx={{
                paddingLeft: 1,
                paddingRight: 1,
            }}
        >
            <img
                style={{ height: "25px", width: "25px" }}
                src={url}
            />
        </Icon>
    );
}
export default SetSymbol;