declare class QRCode {
  constructor(element: HTMLElement, options: {
    text: string;
    width?: number;
    height?: number;
    colorDark?: string;
    colorLight?: string;
    correctLevel?: number;
  });

  static CorrectLevel: {
    L: number;
    M: number;
    Q: number;
    H: number;
  };

  clear(): void;
  makeCode(text: string): void;
}

declare global {
  interface Window {
    QRCodeLoaded: boolean;
    QRCode: {
      new (element: HTMLElement, options: {
        text: string;
        width?: number;
        height?: number;
        colorDark?: string;
        colorLight?: string;
        correctLevel?: number;
      }): QRCode;
      CorrectLevel: {
        L: number;
        M: number;
        Q: number;
        H: number;
      };
    };
  }
} 