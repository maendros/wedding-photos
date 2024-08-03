import { useEffect, useState } from "react";
import axios from "axios";
import Image from "next/image";
import ImageModal from "./ImageModal";
import DelModal from "./DelModal";
import { AiFillDelete, AiOutlineDownload } from "react-icons/ai";

interface FileUrl {
  name: string;
  url: string;
}

interface GalleryProps {
  enableDelete?: boolean;
}

const Gallery: React.FC<GalleryProps> = ({ enableDelete = false }) => {
  const [fileUrls, setFileUrls] = useState<FileUrl[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [loadingImages, setLoadingImages] = useState<{
    [key: number]: boolean;
  }>({});
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteFileName, setDeleteFileName] = useState<string | null>(null);
  const handleDownload = async (url: string, fileName: string) => {
    try {
      console.log(url);

      const response = await fetch(url, { mode: "no-cors" });

      const blob = await response.blob();
      const blobUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = blobUrl;
      link.setAttribute("download", fileName);

      document.body.appendChild(link);
      link.click();

      // Clean up
      link.remove();
      window.URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error("Error downloading the file", error);
    }
  };

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
    if (!enableDelete) {
      setSelectedImage(url);
      document.body.style.overflow = "hidden"; // Disable scrolling when modal is open
    }
  };

  const closeModal = () => {
    setSelectedImage(null);
    document.body.style.overflow = "auto"; // Enable scrolling when modal is closed
  };

  const handleImageLoad = (index: number) => {
    setLoadingImages((prev) => ({
      ...prev,
      [index]: true,
    }));
  };

  const confirmDelete = (fileName: string) => {
    setDeleteFileName(fileName);
    setShowDeleteModal(true);
    document.body.style.overflow = "hidden"; // Disable scrolling when modal is open
  };

  const handleDelete = async () => {
    if (deleteFileName) {
      try {
        await axios.delete(`/api/deleteFile?fileName=${deleteFileName}`);
        setFileUrls((prev) =>
          prev.filter((file) => file.name !== deleteFileName)
        );
        setShowDeleteModal(false);
        document.body.style.overflow = "auto"; // Enable scrolling when modal is closed
      } catch (error) {
        console.error("Error deleting file:", error);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-20 w-20 border-t-2 border-b-2 border-gray-900"></div>
          <p className="mt-4">Φόρτωση...</p>
        </div>
      </div>
    );
  }

  if (fileUrls.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Δεν έχουν ανέβει φωτογραφίες.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2">
        {fileUrls.map((file, index) => (
          <div key={index} className="relative w-full h-80 p-2">
            <div className="relative w-full h-full">
              {!loadingImages[index] && (
                <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg z-10">
                  <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-gray-500"></div>
                </div>
              )}
              <Image
                src={file.url}
                alt={`Image ${index + 1}`}
                layout="fill"
                objectFit="cover"
                className={`rounded-lg transition-opacity duration-500 ${
                  loadingImages[index] ? "opacity-100" : "opacity-0"
                }`}
                onLoad={() => handleImageLoad(index)}
              />
              <a
                href="#"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDownload(file.url, file.name);
                }}
                className="absolute bottom-2 left-2 bg-white text-gray-800 p-2 rounded-full shadow-lg hover:bg-gray-200"
              >
                <AiOutlineDownload size={20} />
              </a>
              {enableDelete && (
                <button
                  className="absolute top-2 right-2 bg-red-600 text-white p-2 rounded-full"
                  onClick={() => confirmDelete(file.name)}
                >
                  <AiFillDelete size={20} />
                </button>
              )}
            </div>
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
      {showDeleteModal && (
        <DelModal
          isOpen={showDeleteModal}
          onClose={() => {
            setShowDeleteModal(false);
            document.body.style.overflow = "auto"; // Enable scrolling when modal is closed
          }}
          onConfirm={handleDelete}
        />
      )}
    </>
  );
};

export default Gallery;
