import { useContext } from 'react'
import { ClientCapabilitiesContext, ExternalLinkContext, ImagePathContext } from '../contexts'

export const useCapabilities = () => useContext(ClientCapabilitiesContext);

export const useExternalLinks = () => useContext(ExternalLinkContext);

export const useImagePaths = () => useContext(ImagePathContext);
