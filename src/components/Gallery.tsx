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
    return <p>Loading...</p>;
  }

  if (fileUrls.length === 0) {
    return <p>No images found.</p>;
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-2">
        {fileUrls.map((file, index) => (
          <div
            key={index}
            className="relative w-80 h-80 p-2 cursor-pointer"
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
