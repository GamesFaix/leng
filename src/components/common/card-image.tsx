import { CircularProgress } from '@mui/material';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getCardImagePath } from '../../sagas/encyclopedia';
import { encyclopediaActions } from '../../store/encyclopedia';
import selectors from '../../store/selectors';

type Props = {
    scryfallId: string
}

const LoadedImage = (props: Props) => {
    const card = useSelector(selectors.card(props.scryfallId));
    const settings = useSelector(selectors.settings);
    const imagePath = React.useMemo(() => getCardImagePath(settings, card), [card, settings]);

    return (<img
        src={imagePath}
        style={{
            width: '100%',
            height: '100%'
        }}
    />);
}

const CardImage = (props: Props) => {
    const dispatch = useDispatch();
    const isImageLoaded = useSelector(selectors.isCardImageLoaded(props.scryfallId));

    React.useEffect(() => {
        if (!isImageLoaded) {
            dispatch(encyclopediaActions.loadCardImageStart(props.scryfallId));
        }
    }, [isImageLoaded, props.scryfallId, dispatch]);

    return (isImageLoaded
        ? <LoadedImage {...props}/>
        : <CircularProgress/>);
}
export default CardImage;