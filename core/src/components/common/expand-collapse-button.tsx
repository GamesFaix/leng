import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconButton } from "@mui/material";
import * as React from "react";
import { icons } from "../../ui/fontawesome";

type Props = {
    isExpanded: boolean,
    onClick: () => void
}

const ExpandCollapseButton = ({ isExpanded, onClick }: Props) => (
    <IconButton
        className="control"
        onClick={onClick}
        title={isExpanded ? "Collapse" : "Expand"}
        color="default"
    >
        <FontAwesomeIcon icon={isExpanded ? icons.collapseArea : icons.expandArea}/>
    </IconButton>
);
export default ExpandCollapseButton;