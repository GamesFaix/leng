import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, Typography } from '@mui/material';
import * as React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { icons } from '../../fontawesome';
import { RootState } from '../../store';
import { inventoryActions } from '../../store/inventory';
import BoxesTable from './boxes-table';
import NewBoxForm from './new-box-form';

const HomePage = () => {
    const settings = useSelector((state: RootState) => state.settings.settings);
    const boxes = useSelector((state: RootState) => state.inventory.boxes);
    const dispatch = useDispatch();
    const [isNewBoxFormVisible, setIsNewBoxFormVisible] = React.useState(false);

    const hideBoxesTable = settings === null || boxes === null;

    React.useEffect(() => {
        if (settings !== null && boxes === null) {
            dispatch(inventoryActions.boxInfosLoadStart());
        }
    });

    function deleteBox(name: string) {
        dispatch(inventoryActions.boxDeleteStart(name));
    }

    return (
        <div>
            <Typography variant="h3">
                Your boxes
            </Typography>
            <br/>
            <IconButton
                title="Add box"
                onClick={() => setIsNewBoxFormVisible(true)}
                color='primary'
            >
                <FontAwesomeIcon icon={icons.add}/>
            </IconButton>
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
            {isNewBoxFormVisible
                ? (<>
                    <NewBoxForm close={() => setIsNewBoxFormVisible(false)}/>
                    <br/>
                </>)
                : ""
            }
            <div className="boxes-area">
                {hideBoxesTable
                    ? "Loading box info..."
                    : (<BoxesTable
                        boxes={boxes}
                        deleteBox={deleteBox}
                    />)
                }
            </div>
        </div>
    );
};
export default HomePage;