import { Card, Collapse, SxProps, Typography } from '@mui/material';
import { Theme } from '@mui/system';
import * as React from 'react';
import ExpandCollapseButton from './expand-collapse-button';

type Props = {
    title: string,
    sx?: SxProps<Theme>,
    children: JSX.Element | JSX.Element[]
}

const CollapsableCard = ({ title, sx, children }: Props) => {
    const [expanded, setExpanded] = React.useState(false);

    return (
        <Card sx={sx}>
            <div style={{ display: 'flex' }}>
                <Typography variant="h5">{title}</Typography>
                <ExpandCollapseButton isExpanded={expanded} onClick={() => setExpanded(!expanded)}/>
            </div>
            <Collapse in={expanded}>
                {children}
            </Collapse>
        </Card>
    );
}
export default CollapsableCard;