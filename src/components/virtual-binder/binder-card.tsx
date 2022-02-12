import { Badge, CircularProgress } from '@mui/material';
import { sumBy } from 'lodash';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BoxCard } from '../../logic/model';
import { getCardImagePath } from '../../sagas/encyclopedia';
import { RootState } from '../../store';
import { encyclopediaActions } from '../../store/encyclopedia';
import selectors from '../../store/selectors';

type Props = {
    cardGroup: BoxCard[], // Group of cards with same name/set/collectors number, but different foil or language
    style?: React.CSSProperties
}

const BinderCard = (props: Props) => {
    const dispatch = useDispatch();
    const settings = useSelector(selectors.settings);
    const card = useSelector(selectors.card(props.cardGroup[0].scryfallId));
    const imagePath = getCardImagePath(settings, card);

    const isImageLoaded = useSelector((state: RootState) => state.encyclopedia.cachedCardImageIds.includes(card.id));

    React.useEffect(() => {
        if (!isImageLoaded) {
            dispatch(encyclopediaActions.loadCardImageStart(card.id));
        }
    })

    // TODO: Display count

    const count = sumBy(props.cardGroup, c => c.count);

    return (
        <Badge
            color="secondary"
            badgeContent={count !== 1 ? count : undefined}
            overlap="circular"
        >
            <div
                style={{
                    ...props.style,
                    overflow: 'clip'
                }}
                title={`${card.name} - ${card.set_name} (${card.collector_number})`}
            >
                {isImageLoaded
                    ? <img
                        src={imagePath}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%'
                        }}
                    />
                    // TODO: Center spinner
                    : <CircularProgress/> }
            </div>
        </Badge>
    )
}
export default BinderCard;