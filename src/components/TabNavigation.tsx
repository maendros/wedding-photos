import { useState } from 'react'
import UploadForm from './UploadForm'
import Gallery from './Gallery'

const TabNavigation: React.FC = () => {
    const [activeTab, setActiveTab] = useState('upload')
    const [uploadedFile, setUploadedFile] = useState<File | null>(null)
    const [fileUrl, setFileUrl] = useState<string | null>(null)

    return (
        <div className="container mx-auto p-4">
            <div className="flex justify-center mb-4">
                <button
                    className={`px-4 py-2 mx-2 ${activeTab === 'upload' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('upload')}
                >
                    Upload Photos
                </button>
                <button
                    className={`px-4 py-2 mx-2 ${activeTab === 'gallery' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    onClick={() => setActiveTab('gallery')}
                >
                    Gallery
                </button>
            </div>
            <div>
                {activeTab === 'upload' ? (
                    <UploadForm setUploadedFile={setUploadedFile} setFileUrl={setFileUrl} />
                ) : (
                    <Gallery />
                )}
            </div>
        </div>
    )
}

export default TabNavigation
