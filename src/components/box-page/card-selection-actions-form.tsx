import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, IconButton, Typography } from '@mui/material';
import * as React from 'react';
import { icons } from '../../fontawesome';
import { BoxCard, BoxCardModule } from '../../logic/model';
import CardTransferForm from './card-transfer-form';

type Props = {
    selectedKeys: string[],
    cards: BoxCard[],
    anyUnsavedChanges: boolean,
    startEdit: (card: BoxCard) => void,
    delete: (card: BoxCard) => void,
    bulkTransferTo: (boxName: string) => void
    singleTransferTo: (count: number, boxName: string) => void
}

const CardSelectionActionsForm = (props: Props) => {

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
                <CardTransferForm
                    selectedKeys={props.selectedKeys}
                    cards={props.cards}
                    singleTransfer={props.singleTransferTo}
                    bulkTransfer={props.bulkTransferTo}
                    disabled={!canTransfer}
                />
            </div>
        </Card>
    );
}
export default CardSelectionActionsForm;