import { useContext } from "react";
import {
  ClientCapabilitiesContext,
  ExternalLinkContext,
  ImagePathContext,
} from "../contexts";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../store";

export const useCapabilities = () => useContext(ClientCapabilitiesContext);

export const useExternalLinks = () => useContext(ExternalLinkContext);

export const useImagePaths = () => useContext(ImagePathContext);

export const useAppDispatch = () => useDispatch<AppDispatch>();

export const useAppSelector = <T>(selector: (state: RootState) => T) =>
  useSelector(selector);
