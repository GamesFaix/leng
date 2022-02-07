import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, FormControlLabel, IconButton } from '@mui/material';
import * as React from 'react';
import { icons } from '../../fontawesome';
import TransferFormBoxSelector from './transfer-form-box-selector';

type Props = {
    transferTo: (boxName: string) => void
}

const TransferForm = (props: Props) => {
    const [boxName, setBoxName] = React.useState<string | null>(null)

    function submit() {
        if (boxName) {
            props.transferTo(boxName);
        }
    }

    return (
        <Card
            sx={{
                width: 700,
                padding: 1
            }}
        >
            <FormControlLabel
                label="Transfer selection to"
                labelPlacement='start'
                control={
                    <TransferFormBoxSelector
                        value={boxName}
                        onChange={setBoxName}
                    />
                }
            />
            <IconButton
                onClick={submit}
                disabled={boxName === null}
            >
                <FontAwesomeIcon icon={icons.ok}/>
            </IconButton>
        </Card>
    );
}
export default TransferForm;