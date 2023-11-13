import { CircularProgress } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { encyclopediaActions } from "../../store/encyclopedia";
import { selectors } from "../../store";
import { useImagePaths } from "../../hooks";
import { useEffect, useMemo } from "react";

type Props = {
  scryfallId: string;
};

const LoadedImage = (props: Props) => {
  const card = useSelector(selectors.card(props.scryfallId));
  const settings = useSelector(selectors.settings);
  const imagePathProvider = useImagePaths();
  const imagePath = useMemo(
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

  useEffect(() => {
    if (!isImageLoaded) {
      dispatch(encyclopediaActions.loadCardImageStart(props.scryfallId));
    }
  }, [isImageLoaded, props.scryfallId, dispatch]);

  return isImageLoaded ? <LoadedImage {...props} /> : <CircularProgress />;
};
