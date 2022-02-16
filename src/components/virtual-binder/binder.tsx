import { Card } from '@mui/material';
import * as React from 'react';
import { Grid, GridCellProps } from 'react-virtualized';
import { BoxCard } from '../../logic/model';
import BinderPage from './binder-page';

const scale = 60;

type Props = {
    pages: BoxCard[][][]
}

const Binder = (props: Props) => {
    const renderCell = ({ columnIndex, style }: GridCellProps) => {
        const page = props.pages[columnIndex];
        return (
            <BinderPage
                style={style}
                cardGroups={page}
                key={columnIndex}
                scale={scale}
            />
        );
    };

    // TODO: Add sort controls

    return (
        <Card
            style={{
                padding: '5px',
                width: '1800px'
            }}
        >
            <Grid
                cellRenderer={renderCell}
                columnCount={props.pages.length}
                columnWidth={500}
                height={740}
                rowCount={1}
                rowHeight={700}
                width={1800}
            />
        </Card>
    )
};
export default Binder;