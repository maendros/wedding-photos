// src/pages/api/toggleUpload.ts
import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import path from "path";

const configFilePath = path.resolve("config.json");

const getConfig = () => {
  const data = fs.readFileSync(configFilePath, "utf-8");
  return JSON.parse(data);
};

const saveConfig = (config: any) => {
  fs.writeFileSync(configFilePath, JSON.stringify(config, null, 2));
};

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    const { enable } = req.body;
    if (typeof enable === "boolean") {
      const config = getConfig();
      config.isUploadEnabled = enable;
      saveConfig(config);
      res.status(200).json({ success: true, isUploadEnabled: enable });
    } else {
      res.status(400).json({ error: "Invalid request" });
    }
  } else if (req.method === "GET") {
    const config = getConfig();
    res.status(200).json({ isUploadEnabled: config.isUploadEnabled });
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
