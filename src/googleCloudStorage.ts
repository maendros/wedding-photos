import dotenv from "dotenv";
import { Storage } from "@google-cloud/storage";
import path from "path";

// Load environment variables from .env file
dotenv.config();

const {
  GOOGLE_APPLICATION_CREDENTIALS,
  GOOGLE_CLOUD_BUCKET_NAME,
  GOOGLE_CLOUD_PROJECT_ID,
} = process.env;

// Initialize Google Cloud Storage
const storage = new Storage({
  keyFilename: path.join(
    process.cwd(),
    GOOGLE_APPLICATION_CREDENTIALS || "google-cloud-key.json"
  ),
  projectId: GOOGLE_CLOUD_PROJECT_ID, // Use environment variable for project ID
});

const bucketName = GOOGLE_CLOUD_BUCKET_NAME || ""; // Use environment variable for bucket name
const bucket = storage.bucket(bucketName);

export { bucket };
