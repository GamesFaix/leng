import { Select } from '@mui/material';
import * as React from 'react';
import { SetInfo } from '../../logic/model';

type Props = {
    value: SetInfo[],
    onChange: (sets: SetInfo[]) => void
}

const SetFilter = (props: Props) => {
    return (
        <Select>
            
        </Select>
    );
}
export default SetFilter;