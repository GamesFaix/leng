import { Badge, CircularProgress, Tooltip } from '@mui/material';
import { sumBy } from 'lodash';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { BoxCard } from '../../logic/model';
import { getCardImagePath } from '../../sagas/encyclopedia';
import { RootState } from '../../store';
import { encyclopediaActions } from '../../store/encyclopedia';
import selectors from '../../store/selectors';
import CardTooltip from './card-tooltip';

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

    const count = sumBy(props.cardGroup, c => c.count);
    const multipleVersionSignifier = props.cardGroup.length > 1 ? '*' : '';
    const badgeContent = `${count}${multipleVersionSignifier}`;

    return (
        <Tooltip
            title={
                <span style={{ whiteSpace: 'pre-line' }}>
                    <CardTooltip cardGroup={props.cardGroup}/>
                </span>
            }
        >
            <Badge
                color="secondary"
                badgeContent={badgeContent}
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