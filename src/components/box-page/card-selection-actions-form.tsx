import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, FormControlLabel, IconButton, Typography } from '@mui/material';
import * as React from 'react';
import { icons } from '../../fontawesome';
import { BoxCard, BoxCardModule } from '../../logic/model';
import TransferFormBoxSelector from './transfer-form-box-selector';

type Props = {
    selectedKeys: string[],
    cards: BoxCard[],
    anyUnsavedChanges: boolean,
    startEdit: (card: BoxCard) => void,
    delete: (card: BoxCard) => void,
    transferTo: (boxName: string) => void
}

const CardSelectionActionsForm = (props: Props) => {
    const [transferToBoxName, setTransferToBoxName] = React.useState<string | null>(null)

    function transfer() {
        if (transferToBoxName) {
            props.transferTo(transferToBoxName);
        }
    }

    function startEdit() {
        const key = props.selectedKeys[0];
        const card = props.cards.find(c => BoxCardModule.getKey(c) === key);
        props.startEdit(card!);
    }

    function deleteSelectedCards() {
        const cards = props.selectedKeys.map(k =>
            props.cards.find(c => BoxCardModule.getKey(c) === k));
        cards.forEach(c => props.delete(c!));
    }

    const canEdit = props.selectedKeys.length === 1;
    const canDelete = props.selectedKeys.length > 0;
    const canTransfer = props.selectedKeys.length > 0
        && transferToBoxName
        && !props.anyUnsavedChanges;

    return (
        <Card
            sx={{
                width: 700,
                padding: 1
            }}
        >
            <Typography>
                {`${props.selectedKeys.length} rows selected`}
            </Typography>

            <div>
                <IconButton
                    title="Edit"
                    disabled={!canEdit}
                    onClick={startEdit}
                >
                    <FontAwesomeIcon icon={icons.edit}/>
                </IconButton>
                <IconButton
                    title="Delete"
                    disabled={!canDelete}
                    onClick={deleteSelectedCards}
                >
                    <FontAwesomeIcon icon={icons.delete}/>
                </IconButton>
                <FormControlLabel
                    label="Transfer to"
                    labelPlacement='start'
                    control={
                        <TransferFormBoxSelector
                            value={transferToBoxName}
                            onChange={setTransferToBoxName}
                        />
                    }
                />
                <IconButton
                    title="Transfer"
                    onClick={transfer}
                    disabled={!canTransfer}
                >
                    <FontAwesomeIcon icon={icons.ok}/>
                </IconButton>
            </div>
        </Card>
    );
}
export default CardSelectionActionsForm;