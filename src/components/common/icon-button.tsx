import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';

type Props = {
    onClick?: () => void,
    title: string,
    icon: IconProp,
    disabled?: boolean
}

const IconButton = (props: Props) => {
    return (<button
        className="icon-button"
        type="button"
        onClick={props.onClick}
        title={props.title}
        disabled={props.disabled}
    >
        <FontAwesomeIcon icon={props.icon}/>
    </button>);
}
export default IconButton