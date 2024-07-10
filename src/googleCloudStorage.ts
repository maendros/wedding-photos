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

let credentials;
if (GOOGLE_APPLICATION_CREDENTIALS) {
  // Base64 decode the credentials and parse JSON
  const credentialsBuffer = Buffer.from(
    GOOGLE_APPLICATION_CREDENTIALS,
    "base64"
  );
  credentials = JSON.parse(credentialsBuffer.toString());
} else {
  throw new Error(
    "GOOGLE_APPLICATION_CREDENTIALS environment variable is missing or invalid."
  );
}

// Initialize Google Cloud Storage
const storage = new Storage({
  credentials, // Pass parsed credentials object directly
  projectId: GOOGLE_CLOUD_PROJECT_ID, // Use environment variable for project ID
});

const bucketName = GOOGLE_CLOUD_BUCKET_NAME || ""; // Use environment variable for bucket name
const bucket = storage.bucket(bucketName);

export { bucket };
