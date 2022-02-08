import { Card } from '@mui/material';
import { chunk } from 'lodash';
import * as React from 'react';
import { Grid, GridCellProps } from 'react-virtualized';
import { BoxCard } from '../../logic/model';
import BinderPage from './binder-page';

type Props = {
    cards: BoxCard[]
}

const Binder = (props: Props) => {
    const pages = chunk(props.cards, 9);

    const renderCell = ({ columnIndex }: GridCellProps) => {
        const page = pages[columnIndex];
        return (
            <BinderPage cards={page}/>
        );
    };

    return (
        <Card>
            <Grid
                cellRenderer={renderCell}
                columnCount={pages.length}
                columnWidth={100}
                height={300}
                rowCount={1}
                rowHeight={100}
                width={300}
            />
        </Card>
    )
};
export default Binder;