import { Icon } from "@mui/material";
import * as React from "react";
import { useSelector } from "react-redux";
import { selectors } from "../../store";
import { ImagePathContext } from "../../ui/image-path-context";

type Props = {
  setAbbrev: string;
};

export const SetSymbol = (props: Props) => {
  const settings = useSelector(selectors.settings);
  const imagePathProvider = React.useContext(ImagePathContext);
  const set = useSelector(selectors.set(props.setAbbrev));
  const url = React.useMemo(
    () => imagePathProvider.getSetSymbolPath(settings, set),
    [settings, imagePathProvider, set]
  );

  return (
    <Icon
      sx={{
        paddingLeft: 1,
        paddingRight: 1,
      }}
    >
      <img className="set-symbol" src={url} />
    </Icon>
  );
};
