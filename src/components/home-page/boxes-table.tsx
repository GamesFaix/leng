import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import * as React from 'react';
import { BoxState } from '../../store/inventory';
import BoxRow from './box-row';

type Props = {
    boxes: BoxState[],
    deleteBox: (name:string) => void
}

const BoxesTable = (props: Props) => {
    return (
        <TableContainer component={Paper}>
            <Table>
                <TableHead>
                    <TableRow>
                        <TableCell></TableCell>
                        <TableCell>Name</TableCell>
                        <TableCell>Last modified</TableCell>
                        <TableCell></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {props.boxes.map(b =>
                        <BoxRow
                            key={b.name}
                            box={b}
                            deleteBox={() => props.deleteBox(b.name)}
                        />
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
}
export default BoxesTable;