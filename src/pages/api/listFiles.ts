import { NextApiRequest, NextApiResponse } from 'next'
import { bucket } from '../../googleCloudStorage'

const listFiles = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    const [files] = await bucket.getFiles();

    const signedUrlsPromises = files.map(async (file) => {
      const [url] = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 1000 * 60 * 60, // 1 hour
      });
      return {
        name: file.name,
        url,
      };
    });

    const fileUrls = await Promise.all(signedUrlsPromises);

    res.status(200).json(fileUrls);
  } catch (error) {
    console.error('Error listing files:', error);
    res.status(500).json({ error: 'Error listing files' });
  }
};

export default listFiles;
