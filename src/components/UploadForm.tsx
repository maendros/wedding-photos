import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios, { AxiosResponse } from "axios";

interface UploadFormProps {
  setUploadedFile: (file: File | null) => void;
  setFileUrl: (url: string | null) => void;
}

interface FormValues {
  file: File | null;
}

const UploadForm: React.FC<UploadFormProps> = ({
  setUploadedFile,
  setFileUrl,
}) => {
  const [uploading, setUploading] = useState(false); // State to track uploading status
  const [uploadProgress, setUploadProgress] = useState(0); // State to track upload progress
  const [previewImage, setPreviewImage] = useState<string | null>(null); // State to hold preview image URL
  const [fileError, setFileError] = useState<string | null>(null); // State to hold file type error

  const formik = useFormik<FormValues>({
    initialValues: {
      file: null,
    },
    validationSchema: Yup.object({
      file: Yup.mixed().required("A file is required"),
    }),
    onSubmit: async (values) => {
      if (values.file) {
        const formData = new FormData();
        formData.append("file", values.file, values.file.name);

        try {
          setUploading(true); // Start uploading

          const response: AxiosResponse<{ url: string }> = await axios.post(
            "/api/upload",
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              onUploadProgress: (progressEvent) => {
                const progress = Math.round(
                  (progressEvent.loaded / (progressEvent.total || 1)) * 100
                );
                setUploadProgress(progress); // Update upload progress
              },
            }
          );

          setFileUrl(response.data.url);
        } catch (error) {
          console.error("Error uploading file", error);
        } finally {
          setUploading(false); // Finish uploading
          setUploadProgress(0); // Reset upload progress
          setUploadedFile(values.file); // Update parent component with uploaded file
        }
      }
    },
  });

  // Function to handle file input change
  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.currentTarget.files
      ? event.currentTarget.files[0]
      : null;

    if (file && !["image/jpeg", "image/png", "image/gif"].includes(file.type)) {
      setFileError("Only image files (jpg, png, gif) are allowed.");
      formik.setFieldValue("file", null);
      setUploadedFile(null);
      setPreviewImage(null);
      return;
    }

    setFileError(null);
    formik.setFieldValue("file", file);
    setUploadedFile(file);

    // Display preview image
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreviewImage(reader.result);
          resizeImage(reader.result); // Resize the image and set the resized preview
        }
      };
    } else {
      setPreviewImage(null);
    }
  };

  // Function to resize the image to fit within specific dimensions
  const resizeImage = (dataURL: string) => {
    const img = new Image();
    img.src = dataURL;

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const maxWidth = 400; // Maximum width for the resized image
      const maxHeight = 400; // Maximum height for the resized image

      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > maxWidth) {
        height *= maxWidth / width;
        width = maxWidth;
      }

      if (height > maxHeight) {
        width *= maxHeight / height;
        height = maxHeight;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (ctx) {
        ctx.drawImage(img, 0, 0, width, height);
        const resizedDataURL = canvas.toDataURL("image/jpeg", 0.7); // Convert to JPEG with quality 0.7
        setPreviewImage(resizedDataURL); // Set the resized preview image
      }
    };
  };

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div className="relative">
        {/* File input */}
        <input
          id="file"
          name="file"
          type="file"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-900 border border-gray-300 rounded-lg cursor-pointer bg-gray-50 focus:outline-none"
        />
      </div>

      {/* Error message */}
      {fileError && <div className="text-red-600">{fileError}</div>}
      {formik.errors.file && (
        <div className="text-red-600">{formik.errors.file}</div>
      )}

      {/* Preview image */}
      {previewImage && (
        <div className="mt-4">
          <img
            src={previewImage}
            alt="Preview"
            className="max-w-full h-auto rounded-lg"
          />
        </div>
      )}

      {/* Upload button with loading state */}
      <button
        type="submit"
        className="px-4 py-2 bg-blue-500 text-white rounded-lg relative"
        disabled={uploading || !!fileError}
      >
        {uploading ? (
          <span className="flex items-center">
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
            Uploading...
          </span>
        ) : (
          "Upload Photo"
        )}
      </button>

      {/* Progress bar for file selection */}
      {uploadProgress > 0 && (
        <span className="flex items-center gap-x-3 whitespace-nowrap">
          <div className="flex w-full h-2 bg-gray-400 rounded-full overflow-hidden">
            <div
              className="flex flex-col justify-center rounded-full overflow-hidden bg-blue-500 text-xs text-white text-center transition duration-500"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
          <div className="w-6 text-end">
            <span className="text-sm text-gray-800">{uploadProgress}%</span>
          </div>
        </span>
      )}
    </form>
  );
};

export default UploadForm;
