import { Icon } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { getSetSymbolImagePath } from '../../sagas/images';
import selectors from 'leng-core/src/store/selectors';

type Props = {
    setAbbrev: string
}

const SetSymbol = (props: Props) => {
    const settings = useSelector(selectors.settings);
    const url = getSetSymbolImagePath(settings, props.setAbbrev);

    return (
        <Icon
            sx={{
                paddingLeft: 1,
                paddingRight: 1,
            }}
        >
            <img
                className="set-symbol"
                src={url}
            />
        </Icon>
    );
}
export default SetSymbol;