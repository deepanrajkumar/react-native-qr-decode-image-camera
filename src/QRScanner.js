import React, { useCallback, useEffect, useRef } from "react";
import { StyleSheet, Text, Vibration, View } from "react-native";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner
} from "react-native-vision-camera";

import QRScannerView from "./QRScannerView";

const defaultRender = () => null;

const clamp01 = value => Math.max(0, Math.min(1, value));

const defaultNotAuthorizedView = (
  <View style={styles.authorizationContainer}>
    <Text style={styles.notAuthorizedText}>Camera permission not granted</Text>
  </View>
);

const defaultNoCameraView = (
  <View style={styles.authorizationContainer}>
    <Text style={styles.notAuthorizedText}>No camera device available</Text>
  </View>
);

export default function QRScanner(props) {
  const {
    onRead,
    isRepeatScan = false,
    scanCooldownMs = 1200,
    cameraPosition = "back",
    device: deviceProp,
    isActive = true,
    torch = false,
    zoom = 0,
    renderTopView = defaultRender,
    renderBottomView = defaultRender,
    topViewStyle,
    bottomViewStyle,
    style,
    cameraStyle,
    notAuthorizedView = defaultNotAuthorizedView,
    noCameraView = defaultNoCameraView,
    requestPermissionOnMount = true,
    codeTypes = ["qr"],
    enablePinchToZoom = true,
    vibrate = true,
    ...overlayProps
  } = props;

  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice(cameraPosition);
  const resolvedDevice = deviceProp || device;

  const didScanRef = useRef(false);
  const lastScanAtRef = useRef(0);

  useEffect(() => {
    if (requestPermissionOnMount) {
      requestPermission();
    }
  }, [requestPermissionOnMount, requestPermission]);

  const onCodeScanned = useCallback(
    codes => {
      if (!codes || codes.length === 0) {
        return;
      }
      if (!isRepeatScan && didScanRef.current) {
        return;
      }
      if (isRepeatScan) {
        const now = Date.now();
        if (now - lastScanAtRef.current < scanCooldownMs) {
          return;
        }
        lastScanAtRef.current = now;
      }

      const code = codes[0];
      const value = code?.value ?? code?.rawValue ?? "";
      if (!value) {
        return;
      }

      if (!isRepeatScan) {
        didScanRef.current = true;
      }

      if (vibrate) {
        Vibration.vibrate();
      }

      if (onRead) {
        onRead({
          data: value,
          rawValue: value,
          type: code?.type,
          bounds: code?.frame,
          native: code
        });
      }
    },
    [isRepeatScan, scanCooldownMs, onRead, vibrate]
  );

  const codeScanner = useCodeScanner({
    codeTypes,
    onCodeScanned
  });

  const resolvedTorch =
    typeof torch === "boolean" ? (torch ? "on" : "off") : torch;
  const normalizedZoom = clamp01(zoom);
  const resolvedZoom = resolvedDevice
    ? resolvedDevice.minZoom +
      (resolvedDevice.maxZoom - resolvedDevice.minZoom) * normalizedZoom
    : normalizedZoom;

  if (!hasPermission) {
    return notAuthorizedView;
  }

  if (!resolvedDevice) {
    return noCameraView;
  }

  return (
    <View style={[styles.container, style]}>
      <Camera
        style={[StyleSheet.absoluteFill, cameraStyle]}
        device={resolvedDevice}
        isActive={isActive}
        codeScanner={codeScanner}
        torch={resolvedTorch}
        zoom={resolvedZoom}
        enableZoomGesture={enablePinchToZoom}
      />
      <QRScannerView {...overlayProps} />
      <View style={[styles.topButtonsContainer, topViewStyle]}>
        {renderTopView()}
      </View>
      <View style={[styles.bottomButtonsContainer, bottomViewStyle]}>
        {renderBottomView()}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  topButtonsContainer: {
    position: "absolute",
    height: 100,
    top: 0,
    left: 0,
    right: 0
  },
  bottomButtonsContainer: {
    position: "absolute",
    height: 100,
    bottom: 0,
    left: 0,
    right: 0
  },
  authorizationContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  },
  notAuthorizedText: {
    textAlign: "center",
    fontSize: 16
  }
});
