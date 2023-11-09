export type AppSettings = {
  dataPath: string;
};

export type ClientCapabilities = {
  export: {
    tappedOutCsv: boolean;
    webJson: boolean;
  };
  edit: {
    boxes: boolean;
  };
  view: {
    boxes: boolean;
    collection: boolean;
    reports: boolean;
    settings: boolean;
  };
};
