import { NativeModules } from "react-native";
import QRscanner from "./src/QRScanner";

const LINKING_ERROR =
  "react-native-qr-decode-image-camera: native module not found. " +
  "Make sure you ran pod install and rebuilt the app.";

const NativeQRCodeImageDecoder =
  NativeModules.QRCodeImageDecoder || NativeModules.QRScanReader;

const decodeImage = fileUri => {
  if (!NativeQRCodeImageDecoder) {
    return Promise.reject(new Error(LINKING_ERROR));
  }
  if (typeof NativeQRCodeImageDecoder.decodeImage === "function") {
    return NativeQRCodeImageDecoder.decodeImage(fileUri);
  }
  if (typeof NativeQRCodeImageDecoder.readerQR === "function") {
    return NativeQRCodeImageDecoder.readerQR(fileUri);
  }
  return Promise.reject(new Error(LINKING_ERROR));
};

const QRreader = fileUri => decodeImage(fileUri);

export { QRscanner, QRreader, decodeImage };
export const QrScanner = QRscanner;
