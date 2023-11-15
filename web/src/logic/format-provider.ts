import { FormatProvider } from "leng-core/src/domain/interfaces"
import { loadFile } from "./file-loader"
import { FormatGroup } from "leng-core/src/domain/formats"
import { AppSettings } from "leng-core/src/domain/config"

export const formatProvider: FormatProvider = {
    getFormats : (settings: AppSettings) => loadFile<FormatGroup[]>("formats.json")
}