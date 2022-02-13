import { Badge, CircularProgress, Tooltip, Typography } from '@mui/material';
import { sumBy } from 'lodash';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BoxCard } from '../../logic/model';
import { getCardImagePath } from '../../sagas/encyclopedia';
import { RootState } from '../../store';
import { encyclopediaActions } from '../../store/encyclopedia';
import selectors from '../../store/selectors';
import FlagIcon from './flag-icon';

type Props = {
    cardGroup: BoxCard[], // Group of cards with same name/set/collectors number, but different foil or language
    style?: React.CSSProperties
}

function getCardLabel(card: BoxCard) {
    const foil = card.foil ? ' Foil' : '';
    return <React.Fragment key={card.scryfallId}>
        <br/>
        <span>
            {card.count} <FlagIcon lang={card.lang}/> {foil}
        </span>
    </React.Fragment>;
}

function getTooltip(cardGroup: BoxCard[])    {
    const card = cardGroup[0];

    return (<Typography>
        {card.name}<br/>
        {`${card.setName} (#${card.collectorsNumber})`}
        {cardGroup.map(getCardLabel)}
    </Typography>);
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

    const count = sumBy(props.cardGroup, c => c.count);
    const tooltip = getTooltip(props.cardGroup);

    return (
        <Tooltip
            title={
                <span style={{ whiteSpace: 'pre-line' }}>
                    {tooltip}
                </span>
            }
        >
            <Badge
                color="secondary"
                badgeContent={count}
                overlap="circular"
            >
                <div
                    style={{
                        ...props.style,
                        overflow: 'clip'
                    }}
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
        </Tooltip>
    )
}
export default BinderCard;