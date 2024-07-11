import { NextApiRequest, NextApiResponse } from "next";
import { bucket } from "../../googleCloudStorage";

const deleteFile = async (req: NextApiRequest, res: NextApiResponse) => {
  const { fileName } = req.query;

  if (!fileName || typeof fileName !== "string") {
    res.status(400).json({ error: "Invalid file name" });
    return;
  }

  try {
    await bucket.file(fileName).delete();
    res.status(200).json({ message: "File deleted successfully" });
  } catch (error) {
    console.error("Error deleting file:", error);
    res.status(500).json({ error: "Error deleting file" });
  }
};

export default deleteFile;
