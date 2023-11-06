import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, TextField } from '@mui/material';
import * as React from 'react';
import { icons } from '../../../ui/fontawesome';
import { BoxCard, BoxCardModule } from "../../../logic/model";
import TransferFormBoxSelector from './transfer-form-box-selector';

type Props = {
    disabled: boolean,
    selectedKeys: string[],
    cards: BoxCard[],
    singleTransfer: (count: number, boxName: string) => void,
    bulkTransfer: (boxName: string) => void
}

const CardTransferForm = (props: Props) => {
    const [boxName, setBoxName] = React.useState<string | null>(null);
    const [count, setCount] = React.useState(1);
    const isSingle = props.selectedKeys.length === 1;
    const disabled = props.disabled || !boxName || props.selectedKeys.length === 0;

    function transferSingle() {
        if (boxName) {
            props.singleTransfer(count, boxName);
            setCount(1);
        }
    }

    function transferBulk() {
        if (boxName) {
            props.bulkTransfer(boxName);
        }
    }

    if (isSingle) {
        const card = props.cards.find(c => BoxCardModule.getKey(c) === props.selectedKeys[0]);
        const maxCount = card?.count ?? 0;

        return (
            <div>
                <span>Transfer</span>
                <TextField
                    className="control"
                    type="number"
                    title="Count"
                    inputProps={{
                        min: 1,
                        max: maxCount,
                    }}
                    sx={{ width: 75 }}
                    value={count}
                    onChange={e => setCount(Number(e.target.value))}
                    onFocus={e => e.target.select()}
                />
                <span>to</span>
                <TransferFormBoxSelector
                    value={boxName}
                    onChange={setBoxName}
                />
                <IconButton
                    title="Transfer"
                    onClick={transferSingle}
                    disabled={disabled}
                >
                    <FontAwesomeIcon icon={icons.ok}/>
                </IconButton>
            </div>
        );
    }
    else {
        return (
            <div>
                <span>Transfer to</span>
                <TransferFormBoxSelector
                    value={boxName}
                    onChange={setBoxName}
                />
                <IconButton
                    title="Transfer"
                    onClick={transferBulk}
                    disabled={disabled}
                >
                    <FontAwesomeIcon icon={icons.ok}/>
                </IconButton>
            </div>
        );
    }
}
export default CardTransferForm;