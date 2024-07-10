import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import ImageModal from "./ImageModal";

interface FileUrl {
  name: string;
  url: string;
}

const Gallery: React.FC = () => {
  const [fileUrls, setFileUrls] = useState<FileUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const response = await axios.get("/api/listFiles");
        setFileUrls(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching files:", error);
        setLoading(false);
      }
    };

    fetchFiles();
  }, []);

  const handleImageClick = (url: string) => {
    setSelectedImage(url);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-900"></div>
          <p className="mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  if (fileUrls.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>No images found.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {fileUrls.map((file, index) => (
          <div
            key={index}
            className="relative w-full h-80 p-2 cursor-pointer"
            onClick={() => handleImageClick(file.url)}
          >
            <Image
              src={file.url}
              alt={`Image ${index + 1}`}
              layout="fill"
              objectFit="cover"
              className="rounded-lg"
            />
          </div>
        ))}
      </div>
      {selectedImage && (
        <ImageModal
          url={selectedImage}
          isOpen={!!selectedImage}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default Gallery;
