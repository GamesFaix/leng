import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Button } from '@mui/material';
import * as React from 'react';

type Props = {
    onClick?: () => void,
    title: string,
    icon: IconProp,
    disabled?: boolean,
    color: string
    variant: string
}

const IconButton = (props: Props) => {
    return (<Button
        className="icon-button"
        type="button"
        onClick={props.onClick}
        title={props.title}
        disabled={props.disabled}
        variant={props.variant as any}
        color={props.color as any}
    >
        <FontAwesomeIcon icon={props.icon}/>
    </Button>);
}
export default IconButton