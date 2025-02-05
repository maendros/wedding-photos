import { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios, { AxiosResponse } from "axios";
import CustomFileInput from "./CustomFileInput";
import ProgressBar from "./ProgressBar";
import UploadButton from "./UploadButton";
import Confetti from "react-confetti";

interface UploadFormProps {
  setUploadedFile: (file: File | null) => void;
  setFileUrl: (url: string | null) => void;
}

interface FormValues {
  file: File | null;
}

const allowedImageTypes = [
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/gif",
  "image/webp",
  "image/bmp",
  "image/tiff",
];

const UploadFormNoComp: React.FC<UploadFormProps> = ({
  setUploadedFile,
  setFileUrl,
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [photoUploadEnabled, setPhotoUploadEnabled] = useState(true);
  const [showSplash, setShowSplash] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUploadState = async () => {
      try {
        const response = await axios.get("/api/toggleUpload");
        setPhotoUploadEnabled(response.data.isUploadEnabled);
      } catch (error) {
        console.error("Error fetching upload state:", error);
        setServerError("Error fetching upload state.");
      }
    };

    fetchUploadState();
  }, []);

  const formik = useFormik<FormValues>({
    initialValues: {
      file: null,
    },
    validationSchema: Yup.object({
      file: Yup.mixed().required("Απαιτείται Φωτογραφία"),
    }),
    onSubmit: async (values) => {
      if (values.file) {
        const formData = new FormData();
        formData.append("file", values.file, values.file.name);

        try {
          setUploading(true);
          setServerError(null);

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
                setUploadProgress(progress);
              },
            }
          );

          setFileUrl(response.data.url);
          setShowSplash(true);
          setTimeout(() => {
            setShowSplash(false);
            setPreviewImage(null);
            setFileName(null);
          }, 3000);
        } catch (error) {
          console.error("Σφάλμα κατα το ανεβασμα της φωτογραφίας", error);
          setServerError("Σφάλμα κατα το ανεβασμα της φωτογραφίας.");
        } finally {
          setUploading(false);
          setUploadProgress(0);
          setUploadedFile(values.file);
        }
      }
    },
  });

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.currentTarget.files
      ? event.currentTarget.files[0]
      : null;
    setPreviewImage(null);
    setServerError(null);
    if (file && !allowedImageTypes.includes(file.type)) {
      setFileError(
        "Μόνο εικονες (jpg, jpeg, png, gif, webp, bmp, tiff) μπορείτε να ανεβάσετε."
      );
      formik.setFieldValue("file", null);
      setUploadedFile(null);

      setFileName(null); // Clear the file name
      return;
    }

    setFileError(null);
    formik.setFieldValue("file", file);
    setUploadedFile(file);
    setFileName(file ? file.name : null); // Set the file name

    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          setPreviewImage(reader.result);
        } else {
          setFileError("Η φωτογραφία δεν διαβάζεται . Προσπαθήστε ξανά.");
        }
      };
      reader.onerror = () => {
        setFileError("Η φωτογραφία δεν διαβάζεται . Προσπαθήστε ξανά.");
      };
    } else {
      setPreviewImage(null);
    }
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="space-y-4 w-full md:w-3/4 lg:w-1/2 xl:w-1/4 mx-auto"
    >
      {showSplash && <Confetti />}
      <div className={`text-green-900 splash ${showSplash ? "show" : ""}`}>
        <h1 className="text-center text-2xl font-bold my-4">Thank you!</h1>
      </div>
      <CustomFileInput
        handleFileChange={handleFileChange}
        disabled={!photoUploadEnabled}
      />

      {fileName && (
        <div className="text-center text-sm text-gray-600 mt-2 break-words">
          {fileName}
        </div>
      )}

      {fileError && <div className="text-red-600">{fileError}</div>}
      {formik.errors.file && (
        <div className="text-red-600">{formik.errors.file}</div>
      )}

      {serverError && (
        <div className="text-center text-red-600 mt-4">{serverError}</div>
      )}

      <div className="grid grid-cols-1 gap-4 justify-items-center">
        <UploadButton
          uploading={uploading}
          fileError={fileError}
          previewImage={previewImage}
          compressionProgress={100} // Always set to 100 since no compression
          photoUploadEnabled={photoUploadEnabled}
        />
      </div>

      {uploadProgress > 0 && (
        <ProgressBar progress={uploadProgress} color="bg-green-500" />
      )}

      {previewImage && (
        <div className="flex items-center justify-center">
          <div className="w-11/12 sm:w-3/4 md:w-3/4 lg:w-2/3 xl:w-3/12 mb-2">
            <img
              src={previewImage}
              alt="Preview"
              className="max-w-full h-auto rounded-lg"
              onError={() =>
                setFileError("Η φωτογραφία δεν μπορεί να φορτωθεί.")
              }
            />
          </div>
        </div>
      )}

      {!photoUploadEnabled && (
        <div className="text-center text-red-600 mt-4">
          Photo uploads are disabled.
        </div>
      )}
    </form>
  );
};

export default UploadFormNoComp;
