import { Card, CircularProgress, Typography } from '@mui/material';
import * as React from 'react';
import lengArt from 'leng-core/src/images/leng.jpg';

type Props = {
    message: string
}

const SplashScreen = (props: Props) => {
    return (
        <Card sx={{
            display: 'flex',
            flexDirection: 'column',
            width: '300px',
            alignItems: 'center',
            padding: '50px'
        }}>
            <Typography variant="h3">
                Leng
            </Typography>
            <figure>
                <img
                    src={lengArt}
                    style={{
                        width: '300px'
                    }}
                />
                <figcaption>
                    Illus. Daniel Gelon
                </figcaption>
            </figure>
            <br/>
            <CircularProgress/>
            <br/>
            <Typography>
                {props.message}
            </Typography>
        </Card>
    )
}
export default SplashScreen;
