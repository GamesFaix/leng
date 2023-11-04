import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Container, IconButton, Typography } from '@mui/material';
import * as React from 'react';
import { icons } from 'leng-core/src/ui/fontawesome';
import BoxesTable from './boxes-table';
import NewBoxForm from './new-box-form';
import { BoxState } from 'leng-core/src/logic/model';

type Props = {
    boxes: BoxState[],
    isNewBoxFormVisible: boolean,
    setIsNewBoxFormVisible: (value: boolean) => void
    delete: (boxName: string) => void
}

const BoxesPage = (props: Props) => {
    return (
        <Container style={{ paddingTop: '12px' }}>
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
        </Container>
    );
};
export default BoxesPage;