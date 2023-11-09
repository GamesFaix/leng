import { createContext } from "react";
import { ClientCapabilities } from "../domain/config";

const defaultValue : Partial<ClientCapabilities> = {
}

export const ClientCapabilitiesContext = createContext(defaultValue);
