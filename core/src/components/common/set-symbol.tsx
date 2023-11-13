import { Icon } from "@mui/material";
import { useSelector } from "react-redux";
import { selectors } from "../../store";
import { useImagePaths } from "../../hooks";
import { useMemo } from "react";

type Props = {
  setAbbrev: string;
};

export const SetSymbol = (props: Props) => {
  const settings = useSelector(selectors.settings);
  const imagePathProvider = useImagePaths();
  const set = useSelector(selectors.set(props.setAbbrev));
  const url = useMemo(
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
