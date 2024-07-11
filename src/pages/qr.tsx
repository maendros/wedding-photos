import { useRouter } from "next/router";
import QRCodeDisplay from "../components/QRCodeDisplay";

const QRPage = () => {
  const router = useRouter();
  const { fileUrl } = router.query;

  // Fallback URL in case fileUrl is not provided
  const url =
    typeof fileUrl === "string"
      ? fileUrl
      : "https://roula-and-kostas-wedding.vercel.app/";

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <h1 className="text-2xl font-bold mb-4">Scan the QR Code</h1>
      <QRCodeDisplay fileUrl={url} />
    </div>
  );
};

export default QRPage;
