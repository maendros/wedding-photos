import { useEffect, useState } from 'react'
import axios from 'axios'

interface FileUrl {
    name: string
    url: string
}

const Gallery: React.FC = () => {
    const [fileUrls, setFileUrls] = useState<FileUrl[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await axios.get('/api/listFiles')
                setFileUrls(response.data)
                setLoading(false)
            } catch (error) {
                console.error('Error fetching files:', error)
                setLoading(false)
            }
        }

        fetchFiles()
    }, [])

    if (loading) {
        return <p>Loading...</p>
    }

    if (fileUrls.length === 0) {
        return <p>No images found.</p>
    }

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {fileUrls.map((file, index) => (
                <div key={index} className="p-2">
                    <img src={file.url} alt={`Image ${index + 1}`} className="w-full h-auto" />
                </div>
            ))}
        </div>
    )
}

export default Gallery
