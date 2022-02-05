import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, Typography } from '@mui/material';
import * as React from 'react';
import { Link } from 'react-router-dom';
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
            <Typography variant="h3">
                Your boxes
            </Typography>
            <br/>
            <IconButton
                title="Add box"
                onClick={() => props.setIsNewBoxFormVisible(true)}
                color='primary'
            >
                <FontAwesomeIcon icon={icons.add}/>
            </IconButton>
            <Link to="/collection">
                <IconButton
                    title="Collection"
                    color='primary'
                >
                    <FontAwesomeIcon icon={icons.collection}/>
                </IconButton>
            </Link>
            <Link to="/reports">
                <IconButton
                    title="Reports"
                    color='primary'
                >
                    <FontAwesomeIcon icon={icons.report}/>
                </IconButton>
            </Link>
            <Link to="/settings">
                <IconButton
                    title="Settings"
                    color='primary'
                >
                    <FontAwesomeIcon icon={icons.settings}/>
                </IconButton>
            </Link>

            <br/>
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