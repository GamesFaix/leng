import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, IconButton, Typography } from '@mui/material';
import * as React from 'react';
import { useSelector } from 'react-redux';
import { icons } from '../../../ui/fontawesome';
import { selectors } from "../../../store";
import BoxTitle from './box-title';

type Props = {
    name: string,
    cardCount: number,
    save: () => void
}

const BoxHeaderCard = (props: Props) => {
    const unsavedChanges = useSelector(selectors.unsavedChanges);

    return (
        <Card
            sx={{
                padding: "6px",
                display: 'flex',
                justifyContent: 'space-between'
            }}
        >
            <div>
                <BoxTitle name={props.name}/>
                <Typography sx={{ fontStyle: "italic" }}>
                    {props.cardCount} cards
                </Typography>
            </div>
            <div
                style={{
                    display: 'flex',
                    alignItems: 'end',
                    flexDirection: 'column',
                }}
            >
                <IconButton
                    title="Save"
                    onClick={() => props.save()}
                    disabled={!unsavedChanges}
                    color='primary'
                >
                    <FontAwesomeIcon icon={icons.save}/>
                </IconButton>
            </div>
        </Card>
    );
}
export default BoxHeaderCard;