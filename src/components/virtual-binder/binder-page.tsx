import { Grid } from '@mui/material';
import * as React from 'react';
import { BoxCard } from '../../logic/model';
import BinderCard from './binder-card';

type Props = {
    cards: BoxCard[]
}

const BinderPage = (props: Props) => {
    return (
        <Grid container spacing={2}>
            {props.cards.map((c,i) =>
                <Grid item
                    xs={2}
                    key={i.toString()}
                >
                    <BinderCard
                        card={c}
                    />
                </Grid>
            )}
        </Grid>
    );
}
export default BinderPage;