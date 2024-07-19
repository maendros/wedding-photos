// src/pages/api/upload.ts
import { NextApiRequest, NextApiResponse } from "next";
import { bucket } from "../../googleCloudStorage";
import fs from "fs";
import formidable from "formidable";
import path from "path";
import sharp from "sharp";

const configFilePath = path.resolve("config.json");

const getConfig = () => {
  const data = fs.readFileSync(configFilePath, "utf-8");
  return JSON.parse(data);
};

export const config = {
  api: {
    bodyParser: false,
  },
};

const compressImage = async (inputPath: string, outputPath: string) => {
  await sharp(inputPath).toFormat("jpeg", { quality: 80 }).toFile(outputPath);
};

const upload = async (req: NextApiRequest, res: NextApiResponse) => {
  const { isUploadEnabled } = getConfig();
  if (!isUploadEnabled) {
    return res.status(403).json({ error: "Photo uploads are disabled." });
  }

  try {
    const form = formidable({ multiples: true });

    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        res.status(500).json({ error: "Error parsing form" });
        return;
      }

      const fileArray = files.file instanceof Array ? files.file : [files.file];

      if (!fileArray || fileArray.length === 0) {
        console.error("No file uploaded");
        res.status(400).json({ error: "No file uploaded" });
        return;
      }

      const file = fileArray[0] as formidable.File;

      // Validate file type
      const validMimeTypes = [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
        "image/bmp",
        "image/tiff",
      ];
      if (!validMimeTypes.includes(file.mimetype!)) {
        console.error("Invalid file type");
        res.status(400).json({ error: "Only image files are allowed" });
        return;
      }

      const compressedFilePath = `${file.filepath}-compressed.jpg`;

      try {
        await compressImage(file.filepath, compressedFilePath);
      } catch (error) {
        console.error("Error compressing image:", error);
        res.status(500).json({ error: "Image compression failed" });
        return;
      }

      const fileStream = fs.createReadStream(compressedFilePath);

      const blob = bucket.file(file.originalFilename!);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: "image/jpeg",
      });

      blobStream.on("error", (err) => {
        console.error("Error uploading file:", err);
        res.status(500).json({ error: "File upload failed" });
      });

      blobStream.on("finish", async () => {
        try {
          // Construct the public URL
          const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`;
          res.status(200).json({ url: publicUrl });
        } catch (error) {
          console.error("Error generating public URL:", error);
          res.status(500).json({ error: "Error generating public URL" });
        }
      });

      fileStream.pipe(blobStream);
    });
  } catch (error) {
    console.error("Unexpected error:", error);
    res.status(500).json({ error: "Unexpected error occurred" });
  }
};

export default upload;
