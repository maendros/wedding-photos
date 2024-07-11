import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Gallery from "../components/Gallery";

const ViewPage: React.FC = () => {
  const [photoUploadEnabled, setPhotoUploadEnabled] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUploadState = async () => {
      try {
        const response = await axios.get("/api/toggleUpload");
        setPhotoUploadEnabled(response.data.isUploadEnabled);
      } catch (error) {
        console.error("Error fetching upload state:", error);
      }
    };

    fetchUploadState();
  }, []);

  const toggleUploadState = async (enable: boolean) => {
    try {
      await axios.post("/api/toggleUpload", { enable });
      setPhotoUploadEnabled(enable);
    } catch (error) {
      console.error("Error toggling upload state:", error);
    }
  };

  return (
    <div>
      <div className="flex justify-center my-4">
        <button
          className={`px-4 py-2 mx-2 ${
            photoUploadEnabled
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-green-500 text-white"
          } rounded-lg`}
          onClick={() => toggleUploadState(true)}
          disabled={photoUploadEnabled}
        >
          Resume Photo Upload
        </button>
        <button
          className={`px-4 py-2 mx-2 ${
            !photoUploadEnabled
              ? "bg-gray-400 text-gray-700 cursor-not-allowed"
              : "bg-red-500 text-white"
          } rounded-lg`}
          onClick={() => toggleUploadState(false)}
          disabled={!photoUploadEnabled}
        >
          Stop Photo Upload
        </button>
        <button
          className="px-4 py-2 mx-2 bg-blue-500 text-white rounded-lg"
          onClick={() => router.push("/")}
        >
          Go to the app
        </button>
      </div>
      {!photoUploadEnabled && (
        <div className="text-center text-red-600 mb-4">
          Photo uploads are disabled.
        </div>
      )}
      <Gallery enableDelete={true} />
    </div>
  );
};

export default ViewPage;
