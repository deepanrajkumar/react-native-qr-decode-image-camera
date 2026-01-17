# react-native-qr-decode-image-camera

Modern QR scanner overlay and image decoder for React Native. This version is built on top of `react-native-vision-camera` for scanning and a lightweight native image decoder for QR codes.

## Install

```bash
yarn add react-native-qr-decode-image-camera react-native-vision-camera
```

or

```bash
npm install react-native-qr-decode-image-camera react-native-vision-camera
```

### iOS

```bash
cd ios
pod install
```

Add camera permission keys to `Info.plist`:

- `NSCameraUsageDescription`
- `NSPhotoLibraryUsageDescription` (if you decode from gallery)

### Android

Ensure your app has camera permission in `AndroidManifest.xml`:

```xml
<uses-permission android:name="android.permission.CAMERA" />
```

## Usage

### Scanner

```javascript
import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { QrScanner } from "react-native-qr-decode-image-camera";

export default function ScannerScreen() {
  const [torch, setTorch] = useState(false);

  return (
    <View style={styles.container}>
      <QrScanner
        onRead={result => {
          console.log("QR value:", result.data);
        }}
        torch={torch}
        isRepeatScan={false}
        renderBottomView={() => (
          <TouchableOpacity
            style={styles.bottomButton}
            onPress={() => setTorch(value => !value)}
          >
            <Text style={styles.bottomText}>{torch ? "Torch On" : "Torch Off"}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  },
  bottomButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.4)"
  },
  bottomText: {
    color: "#fff"
  }
});
```

### Decode from image

```javascript
import { decodeImage } from "react-native-qr-decode-image-camera";

decodeImage(fileUri)
  .then(value => {
    console.log("QR value:", value);
  })
  .catch(error => {
    console.warn("No QR code found", error);
  });
```

`QRreader` is still available as an alias for `decodeImage`.

## Props

### QrScanner

- `onRead` (function, required): called with `{ data, rawValue, type, bounds, native }`.
- `isRepeatScan` (boolean, default `false`): allow repeated scans.
- `scanCooldownMs` (number, default `1200`): throttle between scans when repeated scanning is enabled.
- `cameraPosition` (string, default `"back"`): `"back"` or `"front"`.
- `torch` (boolean or `"on" | "off"`, default `false`): torch state.
- `zoom` (number, default `0`): normalized zoom between `0` and `1`.
- `isActive` (boolean, default `true`): pause/resume camera.
- `codeTypes` (array, default `["qr"]`): barcode types for VisionCamera.
- `requestPermissionOnMount` (boolean, default `true`): auto-request camera permission.
- `enablePinchToZoom` (boolean, default `true`): enable pinch gesture.
- `renderTopView` / `renderBottomView` (function): custom overlay content.
- `topViewStyle` / `bottomViewStyle` (style): containers for custom overlays.
- `notAuthorizedView` / `noCameraView` (node): fallback views.
- `vibrate` (boolean, default `true`): vibrate on scan.

### Overlay props

These control the scanning mask and animation:

- `maskColor`
- `cornerColor`
- `borderColor`
- `rectHeight`
- `rectWidth`
- `borderWidth`
- `cornerBorderWidth`
- `cornerBorderLength`
- `cornerOffsetSize`
- `isCornerOffset`
- `bottomHeight`
- `scanBarAnimateTime`
- `scanBarColor`
- `scanBarImage`
- `scanBarHeight`
- `scanBarMargin`
- `hintText`
- `hintTextStyle`
- `hintTextPosition`
- `isShowScanBar`
- `finderX`
- `finderY`

## Notes

- This library uses `react-native-vision-camera` for scanning. Follow its setup guide if you need camera permissions or additional configuration.
