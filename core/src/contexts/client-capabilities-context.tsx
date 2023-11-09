import { createContext } from "react";
import { ClientCapabilities } from "../logic/model";

const defaultValue : Partial<ClientCapabilities> = {
}

export const ClientCapabilitiesContext = createContext(defaultValue);
