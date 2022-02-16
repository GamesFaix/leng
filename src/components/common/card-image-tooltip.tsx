import { Tooltip } from '@mui/material';
import * as React from 'react';
import CardImage from './card-image';

type Props = {
    scryfallId: string,
    children: React.ReactElement
}

export const CardImageTooltip = (props: Props) => {
    return (
        <Tooltip
            title={
                <div style={{ width: '125px', height: '175px' }}>
                    <CardImage scryfallId={props.scryfallId}/>
                </div>
            }
        >
            {props.children}
        </Tooltip>
    )
}
