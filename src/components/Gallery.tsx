import { useEffect, useState } from 'react'
import axios from 'axios'

interface Photo {
    url: string
}

const Gallery: React.FC = () => {
    const [photos, setPhotos] = useState<Photo[]>([])

    useEffect(() => {
        const fetchPhotos = async () => {
            try {
                const response = await axios.get('/api/photos')
                setPhotos(response.data)
            } catch (error) {
                console.error('Error fetching photos', error)
            }
        }

        fetchPhotos()
    }, [])

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
                <div key={index} className="p-2">
                    <img src={photo.url} alt={`Photo ${index + 1}`} className="w-full h-auto" />
                </div>
            ))}
        </div>
    )
}

export default Gallery
