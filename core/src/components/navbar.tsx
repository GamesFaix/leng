import * as React from "react";
import { useNavigate } from "react-router-dom";
import { AppBar, IconButton } from "@mui/material";
import { Box } from "@mui/system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../ui/fontawesome";
import { selectors } from "../store";
import { editingActions } from "../store/editing";
import { useAppDispatch, useAppSelector, useCapabilities } from "../hooks";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const unsavedChanges = useAppSelector(selectors.unsavedChanges);
  const caps = useCapabilities();

  function confirmIfUnsavedChangesThenNavigateTo(route: string): void {
    const canNavigate =
      !unsavedChanges ||
      confirm(
        "There are unsaved changes. Are you sure you want to leave the page?"
      );

    if (canNavigate) {
      navigate(route);
      dispatch(editingActions.reset());
    }
  }

  return (
    <AppBar position="static">
      <Box sx={{ flexGrow: 1, display: { xs: "none", md: "flex" } }}>
        {caps.view?.collection && (
          <IconButton
            title="Collection"
            color="primary"
            onClick={() => confirmIfUnsavedChangesThenNavigateTo("/collection")}
          >
            <FontAwesomeIcon icon={icons.collection} />
          </IconButton>
        )}
        {caps.view?.boxes && (
          <IconButton
            title="Boxes"
            color="primary"
            onClick={() => confirmIfUnsavedChangesThenNavigateTo("/")}
          >
            <FontAwesomeIcon icon={icons.box} />
          </IconButton>
        )}
        {caps.view?.reports && (
          <IconButton
            title="Reports"
            color="primary"
            onClick={() => confirmIfUnsavedChangesThenNavigateTo("/reports")}
          >
            <FontAwesomeIcon icon={icons.report} />
          </IconButton>
        )}
        {caps.view?.settings && (
          <IconButton
            title="Settings"
            color="primary"
            onClick={() => confirmIfUnsavedChangesThenNavigateTo("/settings")}
          >
            <FontAwesomeIcon icon={icons.settings} />
          </IconButton>
        )}
      </Box>
    </AppBar>
  );
};

export default NavBar;
