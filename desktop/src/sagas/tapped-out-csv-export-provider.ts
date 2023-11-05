import { createObjectCsvWriter } from "csv-writer";
import { TappedOutCsvExportProvider } from "leng-core/src/logic/interfaces";
import { AppSettings } from "leng-core/src/logic/model";
import { TappedOutCsvExportCard } from "leng-core/src/logic/tappedout-csv-export";
import * as moment from "moment";

const exportCards = async (
  settings: AppSettings,
  cards: TappedOutCsvExportCard[]
): Promise<void> => {
  const timestamp = moment.utc().format("YYYY-MM-DD-HH-mm-ss");
  const writer = createObjectCsvWriter({
    path: `${settings.dataPath}/collection-${timestamp}.csv`,
    header: [
      "count",
      "name",
      "setAbbrev",
      "language",
      "condition",
      "foilCount",
      "multiverseId",
    ],
  });
  await writer.writeRecords(cards);
};

export const tappedOutCsvExportProvider: TappedOutCsvExportProvider = {
  exportCards,
};
