import { Storage } from '@google-cloud/storage'
import path from 'path'

// Initialize Google Cloud Storage
const storage = new Storage({
    keyFilename: path.join(process.cwd(), 'google-cloud-key.json'),
    projectId: 'wedding-photos-429010', // Replace with your project ID
})

const bucketName = 'photo-bucket_2024' // Replace with your bucket name
const bucket = storage.bucket(bucketName)

export { bucket }
