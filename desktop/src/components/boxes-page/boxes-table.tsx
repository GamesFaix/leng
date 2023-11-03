import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, CircularProgress, IconButton } from '@mui/material';
import * as moment from 'moment';
import * as React from 'react';
import { Link } from 'react-router-dom';
import { Column, Table, TableCellProps } from 'react-virtualized';
import { icons } from '../../fontawesome';
import { BoxCard } from "leng-core/src/logic/model";
import { BoxState } from '../../store/inventory';

type Props = {
    boxes: BoxState[],
    deleteBox: (name:string) => void
}

function InspectButtonCell(props: TableCellProps) {
    const name : string = props.cellData;
    return (
        <Link to={`/boxes/${name}`}>
            <IconButton
                title="Open box"
                color='primary'
            >
                <FontAwesomeIcon icon={icons.open}/>
            </IconButton>
        </Link>
    );
}

function CountCell(props: TableCellProps) {
    const cards: BoxCard[] = props.cellData;
    const cardCount = cards?.map(c => c.count).reduce((a,b) => a+b, 0) ?? null;

    return (<div style={{alignContent: 'right'}}>
        {cardCount === null
            ? <CircularProgress/>
            : cardCount
        }
    </div>);
}

function LastModifiedCell(props: TableCellProps) {
    const lastModified : Date = props.cellData;
    return (<div>
        {moment(lastModified).calendar()}
    </div>)
}

const BoxesTable = (props: Props) => {
    function DeleteCell(cellProps: TableCellProps) {
        const name : string = cellProps.cellData;
        return (
            <IconButton
                title="Delete box"
                onClick={() => {
                    if (confirm("Are you sure you want to exile this box?")) {
                        props.deleteBox(name);
                    }
                }}
                color='primary'
            >
                <FontAwesomeIcon icon={icons.delete}/>
            </IconButton>
        )
    }

    return (
        <Card sx={{
            height: 600,
            width: 800,
            padding: 2
        }}>
            <Table
                width={800}
                height={600}
                headerHeight={20}
                rowHeight={50}
                rowCount={props.boxes.length}
                rowGetter={({index}) => props.boxes[index]}
                // TODO: Sorting
            >
                <Column
                    width={50}
                    label=''
                    dataKey='name'
                    cellRenderer={InspectButtonCell}
                />
                <Column
                    width={350}
                    label='Name'
                    dataKey='name'
                />
                <Column
                    width={250}
                    label='Last modified'
                    dataKey='lastModified'
                    cellRenderer={LastModifiedCell}
                />
                <Column
                    width={50}
                    label='Size'
                    dataKey='cards'
                    cellRenderer={CountCell}
                />
                <Column
                    width={50}
                    label=''
                    dataKey='name'
                    cellRenderer={DeleteCell}
                />
            </Table>
        </Card>
    );
}
export default BoxesTable;