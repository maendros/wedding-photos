import { Storage } from '@google-cloud/storage'
import path from 'path'

// Initialize Google Cloud Storage
const storage = new Storage({
    keyFilename: path.join(process.cwd(), 'google-cloud-key.json'),
    projectId: 'your_project_id',
})

const bucketName = 'your_bucket_name'
const bucket = storage.bucket(bucketName)

export { bucket }
