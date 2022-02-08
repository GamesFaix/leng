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

    const renderCell = ({ columnIndex, style }: GridCellProps) => {
        const page = pages[columnIndex];
        return (
            <BinderPage
                style={style}
                cards={page}
                key={columnIndex}
                scale={30}
            />
        );
    };

    return (
        <Card
            style={{
                padding: '5px'
            }}
        >
            <Grid
                cellRenderer={renderCell}
                columnCount={pages.length}
                columnWidth={250}
                height={370}
                rowCount={1}
                rowHeight={360}
                width={1000}
            />
        </Card>
    )
};
export default Binder;