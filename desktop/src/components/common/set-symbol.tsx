import { Icon } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import selectors from 'leng-core/src/store/selectors';
import { imagePathProvider } from '../../file-system';

type Props = {
    setAbbrev: string
}

const SetSymbol = (props: Props) => {
    const settings = useSelector(selectors.settings);
    const url = imagePathProvider.getSetSymbolPath(settings, props.setAbbrev);

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