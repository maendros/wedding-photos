import QRCode from 'qrcode.react'

interface QRCodeDisplayProps {
    fileUrl: string
}

const QRCodeDisplay: React.FC<QRCodeDisplayProps> = ({ fileUrl }) => (
    <div>
        <h2>Scan the QR code to view the uploaded photo</h2>
        <QRCode value={fileUrl} />
    </div>
)

export default QRCodeDisplay
