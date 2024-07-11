import { NextApiRequest, NextApiResponse } from "next";
import { bucket } from "../../googleCloudStorage";
import fs from "fs";
import formidable from "formidable";

export const config = {
  api: {
    bodyParser: false,
  },
};

const upload = async (req: NextApiRequest, res: NextApiResponse) => {
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
      const validMimeTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!validMimeTypes.includes(file.mimetype!)) {
        console.error("Invalid file type");
        res.status(400).json({ error: "Only image files are allowed" });
        return;
      }

      const fileStream = fs.createReadStream(file.filepath);

      const blob = bucket.file(file.originalFilename!);
      const blobStream = blob.createWriteStream({
        resumable: false,
        contentType: file.mimetype as string,
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
