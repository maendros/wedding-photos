import { NextApiRequest, NextApiResponse } from 'next'
import formidable, { File } from 'formidable'
import AWS from 'aws-sdk'
import fs from 'fs'

AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    region: process.env.AWS_REGION,
})

const s3 = new AWS.S3()

export const config = {
    api: {
        bodyParser: false
    }
}

const upload = async (req: NextApiRequest, res: NextApiResponse) => {
    const form = new formidable.IncomingForm()

    form.parse(req, async (err, fields, files) => {
        if (err) {
            res.status(500).json({ error: 'File upload failed' })
            return
        }

        const fileArray = files.file as File[] | undefined

        if (!fileArray || fileArray.length === 0) {
            res.status(400).json({ error: 'No file uploaded' })
            return
        }

        const file = fileArray[0]
        const fileStream = fs.createReadStream(file.filepath)

        const params = {
            Bucket: process.env.AWS_S3_BUCKET_NAME!,
            Key: file.originalFilename!,
            Body: fileStream,
            ContentType: file.mimetype
        }

        try {
            const uploadResult = await s3.upload(params).promise()
            res.status(200).json({ url: uploadResult.Location })
        } catch (error) {
            res.status(500).json({ error: 'File upload to S3 failed' })
        }
    })
}

export default upload
