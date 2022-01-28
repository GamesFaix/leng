import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Card, IconButton, Typography } from '@mui/material';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { icons } from '../../fontawesome';
import BoxTitle from './box-title';

type Props = {
    name: string,
    cardCount: number,
    unsavedChanges: boolean,
    save: () => void
}

const BoxHeaderCard = (props: Props) => {
    const navigate = useNavigate();

    return (
        <Card
            sx={{
                padding: "6px",
                width: 700,
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
                    title="Home"
                    onClick={() => {
                        if (props.unsavedChanges && !confirm("There are unsaved changes. Are you sure you want to go back?")) {
                            return;
                        }
                        navigate('/', { replace: true });
                    }}
                    color='primary'
                >
                    <FontAwesomeIcon icon={icons.home}/>
                </IconButton>
                <IconButton
                    title="Save"
                    onClick={() => props.save()}
                    disabled={!props.unsavedChanges}
                    color='primary'
                >
                    <FontAwesomeIcon icon={icons.save}/>
                </IconButton>
            </div>
        </Card>
    );
}
export default BoxHeaderCard;