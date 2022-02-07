import { Card, CircularProgress, Typography } from '@mui/material';
import * as React from 'react';
import lengArt from '../images/leng.jpg';

type Props = {
    message: string
}

const SplashScreen = (props: Props) => {
    return (
        <Card>
            <img src={lengArt}/>
            <CircularProgress/>
            <Typography variant="h4">
                {props.message}
            </Typography>
        </Card>
    )
}
export default SplashScreen;
