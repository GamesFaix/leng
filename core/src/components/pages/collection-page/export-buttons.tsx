import { IconButton } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { icons } from "../../../ui/fontawesome";
import { useCapabilities } from "../../../hooks";
import { FC } from "react";

type Props = {
  exportTappedOutCsv: () => void;
  exportWebJson: () => void;
};

export const ExportButtons: FC<Props> = ({
  exportTappedOutCsv,
  exportWebJson,
}) => {
  const caps = useCapabilities();

  return (
    <div>
      {exportTappedOutCsv && caps.export?.tappedOutCsv && (
        <IconButton
          title="Export TappedOut CSV"
          color="primary"
          onClick={() => exportTappedOutCsv()}
        >
          <FontAwesomeIcon icon={icons.export} />
        </IconButton>
      )}
      {exportWebJson && caps.export?.webJson && (
        <IconButton
          title="Export Leng-Web JSON"
          color="primary"
          onClick={() => exportWebJson()}
        >
          <FontAwesomeIcon icon={icons.export} />
        </IconButton>
      )}
    </div>
  );
};
