import { Card } from '@mui/material';
import { Grid, GridCellProps } from 'react-virtualized';
import { BoxCard } from "../../domain/inventory";
import BinderPage from './binder-page';
import { useCallback } from 'react';

const scale = 60;

type Props = {
    pages: BoxCard[][][]
}

export const Binder = (props: Props) => {
    const renderCell = useCallback(({ columnIndex, style }: GridCellProps) => {
        const page = props.pages[columnIndex];
        return (
            <BinderPage
                style={style}
                cardGroups={page}
                key={columnIndex}
                scale={scale}
            />
        );
    }, [props.pages]);

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