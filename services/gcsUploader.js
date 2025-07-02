import { Storage } from "@google-cloud/storage";
import path from "path";
import fs from "fs";
import dotenv from "dotenv";
dotenv.config();

const storage = new Storage({
  keyFilename: process.env.GOOGLE_APPLICATION_CREDENTIALS,
});
const bucketName = "etiket_logs_storage";

export const uploadLogsToGCS = async () => {
  const date = new Date();
  const dateStr = date.toISOString().split("T")[0];
  const timeStr = date
    .toISOString()
    .split("T")[1]
    .replace(/:/g, "-")
    .split(".")[0];

  const logFilePath = path.join("logs", `logs-${dateStr}.jsonl`);
  const destination = `logs/${dateStr}/logs-${timeStr}.jsonl`;

  try {
    await storage.bucket(bucketName).upload(logFilePath, { destination });
    console.log(`✅ Log file uploaded to GCS: ${destination}`);
    fs.unlinkSync(logFilePath);
  } catch (error) {
    console.error("❌ Erreur upload GCS:", error);
  }
};
