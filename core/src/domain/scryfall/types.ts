export type BulkData = {
  object: string;
  id: string;
  type: string;
  updatedAt: string;
  uri: string;
  name: string;
  description: string;
  compressed_size: number;
  download_uri: string;
  content_type: string;
  content_encoding: string;
};

export type ScryfallResponse<T> = {
  object: string;
  has_more: boolean;
  data: T;
};
