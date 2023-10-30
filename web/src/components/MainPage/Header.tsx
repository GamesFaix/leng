import { FC } from "react";
import { IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import { routes } from "../../routes";

const Header: FC = () => {
  const navigate = useNavigate();

  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        alignItems: "center",
        verticalAlign: "center",
        alignContent: "center",
        justifyContent: "center",
        gap: "3px",
      }}
    >
      <div style={{ float: "left", width: "33.33%" }}></div>
      <div
        style={{
          width: "33.33%",
          display: "flex",
          alignItems: "center",
          verticalAlign: "center",
          alignContent: "center",
          justifyContent: "center",
          gap: "3px",
        }}
      >
        <IconButton title="Home" onClick={() => navigate(routes.home)}>
          <FontAwesomeIcon icon={faHome} />
        </IconButton>
        
      </div>
      <div style={{ float: "right", width: "33.33%" }}></div>
    </div>
  );
};

export default Header;
