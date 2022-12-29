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
    console.log('Rendering Binder');
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
            }}
        >
            <Grid
                cellRenderer={renderCell}
                columnCount={props.pages.length}
                columnWidth={500}
                height={680}
                rowCount={1}
                rowHeight={680}
                width={1480}
            />
        </Card>
    )
};
export default Binder;