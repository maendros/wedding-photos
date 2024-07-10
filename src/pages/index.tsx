import { useState } from 'react'
import QRCodeDisplay from '@components/QRCodeDisplay'
import UploadForm from '@components/UploadForm'


const Home = () => {
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [fileUrl, setFileUrl] = useState<string | null>(null)

    return (
        <div>
            <h1>Wedding Photos Upload</h1>
            <UploadForm setUploadedFile={setUploadedFile} setFileUrl={setFileUrl} />
            {fileUrl && <QRCodeDisplay fileUrl={fileUrl} />}
        </div>
    )
}

export default Home
