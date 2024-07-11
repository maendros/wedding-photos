import React, { useEffect } from "react";
import Image from "next/image";

interface ImageModalProps {
  url: string;
  isOpen: boolean;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ url, isOpen, onClose }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75">
      <button className="absolute top-4 right-4 text-white" onClick={onClose}>
        Κλείσιμο
      </button>
      <div className="relative w-3/4 h-3/4">
        <Image
          src={url}
          alt="Full screen"
          layout="fill"
          objectFit="contain"
          className="rounded-lg"
        />
      </div>
    </div>
  );
};

export default ImageModal;
