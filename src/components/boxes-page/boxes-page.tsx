import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, Typography } from '@mui/material';
import * as React from 'react';
import { icons } from '../../fontawesome';
import { BoxState } from '../../store/inventory';
import BoxesTable from './boxes-table';
import NewBoxForm from './new-box-form';

type Props = {
    boxes: BoxState[],
    isNewBoxFormVisible: boolean,
    setIsNewBoxFormVisible: (value: boolean) => void
    delete: (boxName: string) => void
}

const BoxesPage = (props: Props) => {
    return (
        <div>
            <div style={{ display: 'flex' }}>
                <Typography variant="h4">
                    Boxes
                </Typography>
                <IconButton
                    title="Add box"
                    onClick={() => props.setIsNewBoxFormVisible(true)}
                    color='primary'
                >
                    <FontAwesomeIcon icon={icons.add}/>
                </IconButton>
            </div>
            <br/>
            {props.isNewBoxFormVisible
                ? (<>
                    <NewBoxForm close={() => props.setIsNewBoxFormVisible(false)}/>
                    <br/>
                </>)
                : ""
            }
            <div className="boxes-area">
                <BoxesTable
                    boxes={props.boxes}
                    deleteBox={props.delete}
                />
            </div>
        </div>
    );
};
export default BoxesPage;