import {
  S3Client,
  CopyObjectCommand,
  CopyObjectCommandInput,
} from "@aws-sdk/client-s3";

const { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_REGION, AWS_S3_BUCKET } =
  process.env;

if (!AWS_ACCESS_KEY_ID) throw "AWS_ACCESS_KEY_ID env var not set";
if (!AWS_SECRET_ACCESS_KEY) throw "AWS_SECRET_ACCESS_KEY env var not set";
if (!AWS_REGION) throw "AWS_REGION env var not set";
if (!AWS_S3_BUCKET) throw "AWS_S3_BUCKET env var not set";

const client = new S3Client({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESS_KEY_ID,
    secretAccessKey: AWS_SECRET_ACCESS_KEY,
  },
});

const setGzipEncoding = async (file: string) => {
  const param: CopyObjectCommandInput = {
    Bucket: AWS_S3_BUCKET,
    Key: file,
    CopySource: `${AWS_S3_BUCKET}/${file}`,
    ContentEncoding: "gzip",
  };
  const cmd = new CopyObjectCommand(param);
  await client.send(cmd);
};

const updateFileMetadata = async () => {
  await setGzipEncoding("data/encyclopedia/cards.json.gz");
  await setGzipEncoding("data/encyclopedia/sets.json.gz");
};

updateFileMetadata().catch(console.error);
