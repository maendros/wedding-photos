import { NextApiRequest, NextApiResponse } from 'next'
import formidable, { File } from 'formidable'
import { bucket } from '../../googleCloudStorage'
import fs from 'fs'

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

        const fileArray = files.file as formidable.File[] | undefined

        if (!fileArray || fileArray.length === 0) {
            res.status(400).json({ error: 'No file uploaded' })
            return
        }

        const file = fileArray[0]
        const fileStream = fs.createReadStream(file.filepath)

        const blob = bucket.file(file.originalFilename!)
        const blobStream = blob.createWriteStream({
            resumable: false,
            contentType: file?.mimetype as string,
            predefinedAcl: 'publicRead'
        })

        blobStream.on('error', (err) => {
            console.error(err)
            res.status(500).json({ error: 'File upload failed' })
        })

        blobStream.on('finish', () => {
            const publicUrl = `https://storage.googleapis.com/${bucket.name}/${blob.name}`
            res.status(200).json({ url: publicUrl })
        })

        fileStream.pipe(blobStream)
    })
}

export default upload
