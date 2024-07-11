import QRCode from "qrcode.react";

interface QRCodeDisplayProps {
  fileUrl: string;
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ fileUrl }) => (
  <div>
    <QRCode value={fileUrl} />
  </div>
);

export default QRCodeDisplay;
