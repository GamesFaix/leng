import { createObjectCsvWriter } from "csv-writer";
import { AppSettings } from "leng-core/src/domain/config";
import { TappedOutCsvExportCard } from "leng-core/src/domain/export/tappedout-csv-export";
import { TappedOutCsvExportProvider } from "leng-core/src/domain/interfaces";
import { utc } from "moment";

const exportCards = async (
  settings: AppSettings,
  cards: TappedOutCsvExportCard[]
): Promise<void> => {
  const timestamp = utc().format("YYYY-MM-DD-HH-mm-ss");
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
