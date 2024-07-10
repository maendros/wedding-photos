import { NextApiRequest, NextApiResponse } from "next";
import { bucket } from "../../googleCloudStorage";

const listFiles = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const [files] = await bucket.getFiles();

    const fileUrls = files.map((file) => ({
      name: file.name,
      url: `https://storage.googleapis.com/${bucket.name}/${file.name}`,
    }));

    res.status(200).json(fileUrls);
  } catch (error) {
    console.error("Error listing files:", error);
    res.status(500).json({ error: "Error listing files" });
  }
};

export default listFiles;
