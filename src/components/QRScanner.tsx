import { Scanner } from "@yudiel/react-qr-scanner";

interface QRScannerProps {
    onScan: (value: string) => void;
    onError?: (error: unknown) => void;
    paused?: boolean;
}

function QRScanner({ onScan, onError, paused }: QRScannerProps) {
    return (
        <Scanner
            sound
            paused={paused}
            onScan={(res) => {
                if (res?.[0]?.rawValue) {
                    onScan(res[0].rawValue);
                }
            }}
            onError={onError}
        />
    );
}

export default QRScanner;
