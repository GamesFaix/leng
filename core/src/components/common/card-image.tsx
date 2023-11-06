import { CircularProgress } from "@mui/material";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { encyclopediaActions } from "../../store/encyclopedia";
import { selectors } from "../../store";
import { ImagePathContext } from "../../ui/image-path-context";

type Props = {
  scryfallId: string;
};

const LoadedImage = (props: Props) => {
  const card = useSelector(selectors.card(props.scryfallId));
  const settings = useSelector(selectors.settings);
  const imagePathProvider = React.useContext(ImagePathContext);
  const imagePath = React.useMemo(
    () => imagePathProvider.getCardImagePath(settings, card),
    [card, settings, imagePathProvider]
  );

  return (
    <img
      src={imagePath}
      style={{
        width: "100%",
        height: "100%",
      }}
    />
  );
};

export const CardImage = (props: Props) => {
  const dispatch = useDispatch();
  const isImageLoaded = useSelector(
    selectors.isCardImageLoaded(props.scryfallId)
  );

  React.useEffect(() => {
    if (!isImageLoaded) {
      dispatch(encyclopediaActions.loadCardImageStart(props.scryfallId));
    }
  }, [isImageLoaded, props.scryfallId, dispatch]);

  return isImageLoaded ? <LoadedImage {...props} /> : <CircularProgress />;
};
