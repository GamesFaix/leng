import { Card, CircularProgress, Typography } from '@mui/material';
import * as React from 'react';

type Props = {
    message: string
}

const SplashScreen = (props: Props) => {
    return (
        <Card>
            <CircularProgress/>
            <Typography variant="h4">
                {props.message}
            </Typography>
        </Card>
    )
}
export default SplashScreen;
