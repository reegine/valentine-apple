declare module 'react-barcode-reader' {
  import { Component } from 'react';

  interface BarcodeReaderProps {
    onScan?: (barcode: string) => void;
    onError?: (error: any) => void;
    onReceive?: (barcode: string) => void;
    minLength?: number;
    scanButton?: boolean;
    stopPropagation?: boolean;
    preventDefault?: boolean;
  }

  export default class BarcodeReader extends Component<BarcodeReaderProps> {}
}