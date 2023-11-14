import { writeFileSync } from "fs";
import { resolve } from "path";

const { AWS_REGION, AWS_S3_BUCKET } = process.env;

if (!AWS_REGION) throw "AWS_REGION env var not set";
if (!AWS_S3_BUCKET) throw "AWS_S3_BUCKET env var not set";

const domain = `http://${AWS_S3_BUCKET}.s3-website-${AWS_REGION}.amazonaws.com`;
const distDir = resolve(__dirname, "../dist");

const downloadInventory = async () => {
  const file = "data/inventory.json";
  const url = `${domain}/${file}`;

  console.log("downloading inventory...");
  const response = await fetch(url);
  const text = await response.text();

  const path = `${distDir}/${file}`;
  console.log("writing inventory file...");
  writeFileSync(path, text);
};

downloadInventory().catch(console.error);
