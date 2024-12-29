interface QRCode {
  addData(data: string, mode?: string): void;
  make(): void;
  createSvgTag(cellSize?: number, margin?: number): string;
  createTableTag(cellSize?: number, margin?: number): string;
}

interface QRCodeFactory {
  (typeNumber: number, errorCorrectionLevel: string): QRCode;
}

declare global {
  interface Window {
    QRCodeLoaded: boolean;
    qrcode: QRCodeFactory;
  }
}

export {}; 