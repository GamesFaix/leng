import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { AppBar, IconButton } from '@mui/material';
import { Box } from '@mui/system';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { icons } from 'leng-core/src/ui/fontawesome';
import { useDispatch, useSelector } from 'react-redux';
import selectors from 'leng-core/src/store/selectors';
import { editingActions } from 'leng-core/src/store/editing';

const NavBar = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const unsavedChanges = useSelector(selectors.unsavedChanges);

    function confirmIfUnsavedChangesThenNavigateTo(route: string) : void {
        const canNavigate = !unsavedChanges
            || confirm("There are unsaved changes. Are you sure you want to leave the page?");

        if (canNavigate) {
            navigate(route);
            dispatch(editingActions.reset());
        }
    }

    return (
        <AppBar position='static'>
            <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                <IconButton
                    title="Collection"
                    color='primary'
                    onClick={() => confirmIfUnsavedChangesThenNavigateTo("/collection")}
                >
                    <FontAwesomeIcon icon={icons.collection}/>
                </IconButton>
                <IconButton
                    title="Boxes"
                    color='primary'
                    onClick={() => confirmIfUnsavedChangesThenNavigateTo("/")}
                >
                    <FontAwesomeIcon icon={icons.box}/>
                </IconButton>
                <IconButton
                    title="Reports"
                    color='primary'
                    onClick={() => confirmIfUnsavedChangesThenNavigateTo("/reports")}
                >
                    <FontAwesomeIcon icon={icons.report}/>
                </IconButton>
                <IconButton
                    title="Settings"
                    color='primary'
                    onClick={() => confirmIfUnsavedChangesThenNavigateTo("/settings")}
                >
                    <FontAwesomeIcon icon={icons.settings}/>
                </IconButton>
            </Box>
        </AppBar>
    );
}

export default NavBar;
