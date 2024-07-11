import React from "react";

interface UploadButtonProps {
  uploading: boolean;
  fileError: string | null;
  previewImage: string | null;
  compressionProgress: number;
  photoUploadEnabled: boolean;
}

const UploadButton: React.FC<UploadButtonProps> = ({
  uploading,
  fileError,
  previewImage,
  compressionProgress,
  photoUploadEnabled,
}) => (
  <button
    type="submit"
    className={`w-full h-12 rounded-lg relative ${
      uploading ||
      !!fileError ||
      !previewImage ||
      compressionProgress < 100 ||
      !photoUploadEnabled
        ? "bg-gray-400 text-gray-700 cursor-not-allowed"
        : "bg-green-500 text-white"
    }`}
    disabled={
      uploading ||
      !!fileError ||
      !previewImage ||
      compressionProgress < 100 ||
      !photoUploadEnabled
    }
  >
    {uploading ? (
      <span className="flex items-center justify-center">
        <svg
          className="animate-spin h-5 w-5 mr-3"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647zM20 4.708c1.865 2.114 3 4.896 3 7.938h4c0-6.627-5.373-12-12-12v4c3.042 0 5.824 1.135 7.938 3l-2.647 3z"
          ></path>
        </svg>
        Η φωτογραφία ανεβαίνει...
      </span>
    ) : (
      "Ανεβάσε Φωτογραφία"
    )}
  </button>
);

export default UploadButton;
