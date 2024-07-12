import { useState } from "react";
import UploadForm from "./UploadForm";
import Gallery from "./Gallery";
import UploadFormNoComp from "./UploadFormNoComp";

const TabNavigation: React.FC = () => {
  const [activeTab, setActiveTab] = useState("upload");
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center mb-4">
        <button
          className={`px-3 py-2 rounded-l-lg  ${
            activeTab === "upload" ? "bg-gray-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("upload")}
        >
          Ανεβάστε Φωτογραφίες
        </button>
        <button
          className={`px-3 py-2 rounded-r-lg   ${
            activeTab === "gallery" ? "bg-gray-500 text-white" : "bg-gray-200"
          }`}
          onClick={() => setActiveTab("gallery")}
        >
          Gallery Φωτογραφιών
        </button>
      </div>
      <div>
        {activeTab === "upload" ? (
          // <UploadForm
          //   setUploadedFile={setUploadedFile}
          //   setFileUrl={setFileUrl}
          // />
          <UploadFormNoComp
            setUploadedFile={setUploadedFile}
            setFileUrl={setFileUrl}
          />
        ) : (
          <Gallery />
        )}
      </div>
    </div>
  );
};

export default TabNavigation;
