import { CircularProgress } from '@mui/material';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BoxCard } from '../../logic/model';
import { getCardImagePath } from '../../sagas/encyclopedia';
import { RootState } from '../../store';
import { encyclopediaActions } from '../../store/encyclopedia';
import selectors from '../../store/selectors';

type Props = {
    card: BoxCard,
    style?: React.CSSProperties
}

const BinderCard = (props: Props) => {
    const dispatch = useDispatch();
    const settings = useSelector(selectors.settings);
    const card = useSelector(selectors.cardIndex)[props.card.scryfallId];
    const imagePath = getCardImagePath(settings, card);

    const isImageLoaded = useSelector((state: RootState) => state.encyclopedia.cachedCardImageIds.includes(props.card.scryfallId));

    React.useEffect(() => {
        if (!isImageLoaded) {
            dispatch(encyclopediaActions.loadCardImageStart(props.card.scryfallId));
        }
    })

    // TODO: Display count
    return (
        <div
            style={{
                ...props.style,
                overflow: 'clip'
            }}
            title={`${props.card.name} - ${props.card.setName} (${props.card.collectorsNumber})`}
        >
            {isImageLoaded
                ? <img
                    src={imagePath}
                    style={{
                        maxWidth: '100%',
                        maxHeight: '100%'
                    }}
                />
                : <CircularProgress/> }
        </div>
    )
}
export default BinderCard;