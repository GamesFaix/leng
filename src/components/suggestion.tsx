import * as React from "react";

type Props<T> = {
    item: T,
    label: string,
    isActive: boolean,
    onClick: (item: T) => void
};

function Suggestion<T> (props: Props<T>) {
    const className = props.isActive
        ? "suggestion active"
        : "suggestion";

    return (
        <button
            className={className}
            onClick={() => props.onClick(props.item)}
        >
            {props.label}
        </button>
    );
};
export default Suggestion;