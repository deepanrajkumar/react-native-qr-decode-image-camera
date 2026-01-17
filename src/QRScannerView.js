import React, { useEffect, useMemo, useRef, useState } from "react";
import { Animated, Easing, Image, StyleSheet, Text, View } from "react-native";

export default function QRScannerView(props) {
  const {
    maskColor = "rgba(0,0,0,0.5)",
    cornerColor = "#22ff00",
    borderColor = "#000000",
    rectHeight = 200,
    rectWidth = 200,
    borderWidth = 0,
    cornerBorderWidth = 4,
    cornerBorderLength = 20,
    cornerOffsetSize = 1,
    isCornerOffset = true,
    bottomHeight = 100,
    scanBarAnimateTime = 2500,
    scanBarColor = "#22ff00",
    scanBarImage = null,
    scanBarHeight = 1.5,
    scanBarMargin = 6,
    hintText = "Put the QR code into the box to scan",
    hintTextStyle = {
      color: "#fff",
      fontSize: 14,
      backgroundColor: "transparent"
    },
    hintTextPosition = 130,
    isShowScanBar = true,
    finderX = 0,
    finderY = 0,
    returnSize,
    style
  } = props;

  const [layout, setLayout] = useState({ width: 0, height: 0 });
  const animatedValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (!isShowScanBar) {
      return undefined;
    }
    animatedValue.setValue(0);
    const animation = Animated.loop(
      Animated.timing(animatedValue, {
        toValue: rectHeight,
        duration: scanBarAnimateTime,
        easing: Easing.linear,
        useNativeDriver: true
      })
    );
    animation.start();
    return () => animation.stop();
  }, [animatedValue, rectHeight, scanBarAnimateTime, isShowScanBar]);

  const rect = useMemo(() => {
    const width = Math.max(0, rectWidth);
    const height = Math.max(0, rectHeight);
    const left =
      layout.width > 0 ? (layout.width - width) / 2 + finderX : 0;
    const top =
      layout.height > 0 ? (layout.height - height) / 2 + finderY : 0;
    const right = Math.max(0, layout.width - left - width);
    return {
      left,
      top,
      width,
      height,
      right
    };
  }, [layout.width, layout.height, rectWidth, rectHeight, finderX, finderY]);

  useEffect(() => {
    if (!returnSize || layout.width === 0 || layout.height === 0) {
      return;
    }
    returnSize({
      x: rect.left,
      y: rect.top,
      width: rect.width,
      height: rect.height
    });
  }, [layout.width, layout.height, rect, returnSize]);

  const borderInset = isCornerOffset ? cornerOffsetSize : 0;
  const borderHeight = rect.height - borderInset * 2;
  const borderWidthValue = rect.width - borderInset * 2;

  const overlayStyle = useMemo(
    () => ({
      ...StyleSheet.absoluteFillObject,
      bottom: bottomHeight
    }),
    [bottomHeight]
  );

  const renderScanBar = () => {
    if (!isShowScanBar) {
      return null;
    }
    const scanWidth = rect.width - scanBarMargin * 2;
    if (scanBarImage) {
      return (
        <Image
          source={scanBarImage}
          style={{ width: scanWidth, height: scanBarHeight }}
          resizeMode="contain"
        />
      );
    }
    return (
      <View
        style={{
          width: scanWidth,
          height: scanBarHeight,
          backgroundColor: scanBarColor
        }}
      />
    );
  };

  return (
    <View
      style={[overlayStyle, style]}
      pointerEvents="none"
      onLayout={event => setLayout(event.nativeEvent.layout)}
    >
      <View
        style={[
          styles.viewfinder,
          {
            left: rect.left,
            top: rect.top,
            width: rect.width,
            height: rect.height
          }
        ]}
      >
        <View
          style={[
            styles.border,
            {
              width: borderWidthValue,
              height: borderHeight,
              borderColor,
              borderWidth
            }
          ]}
        >
          <Animated.View
            style={[
              styles.scanBar,
              {
                marginHorizontal: scanBarMargin,
                transform: [{ translateY: animatedValue }]
              }
            ]}
          >
            {renderScanBar()}
          </Animated.View>
        </View>
        <View
          style={[
            styles.corner,
            styles.topLeftCorner,
            {
              width: cornerBorderLength,
              height: cornerBorderLength,
              borderColor: cornerColor,
              borderLeftWidth: cornerBorderWidth,
              borderTopWidth: cornerBorderWidth
            }
          ]}
        />
        <View
          style={[
            styles.corner,
            styles.topRightCorner,
            {
              width: cornerBorderLength,
              height: cornerBorderLength,
              borderColor: cornerColor,
              borderRightWidth: cornerBorderWidth,
              borderTopWidth: cornerBorderWidth
            }
          ]}
        />
        <View
          style={[
            styles.corner,
            styles.bottomLeftCorner,
            {
              width: cornerBorderLength,
              height: cornerBorderLength,
              borderColor: cornerColor,
              borderLeftWidth: cornerBorderWidth,
              borderBottomWidth: cornerBorderWidth
            }
          ]}
        />
        <View
          style={[
            styles.corner,
            styles.bottomRightCorner,
            {
              width: cornerBorderLength,
              height: cornerBorderLength,
              borderColor: cornerColor,
              borderRightWidth: cornerBorderWidth,
              borderBottomWidth: cornerBorderWidth
            }
          ]}
        />
      </View>

      <View
        style={[
          styles.mask,
          {
            backgroundColor: maskColor,
            left: 0,
            right: 0,
            top: 0,
            height: rect.top
          }
        ]}
      />
      <View
        style={[
          styles.mask,
          {
            backgroundColor: maskColor,
            left: 0,
            width: rect.left,
            top: rect.top,
            height: rect.height
          }
        ]}
      />
      <View
        style={[
          styles.mask,
          {
            backgroundColor: maskColor,
            right: 0,
            width: rect.right,
            top: rect.top,
            height: rect.height
          }
        ]}
      />
      <View
        style={[
          styles.mask,
          {
            backgroundColor: maskColor,
            left: 0,
            right: 0,
            top: rect.top + rect.height,
            bottom: 0
          }
        ]}
      />

      <View
        style={[
          styles.hintContainer,
          {
            bottom: hintTextPosition
          }
        ]}
      >
        <Text style={hintTextStyle}>{hintText}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  viewfinder: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center"
  },
  border: {
    alignItems: "center",
    justifyContent: "flex-start"
  },
  scanBar: {
    position: "absolute",
    left: 0,
    right: 0
  },
  corner: {
    position: "absolute"
  },
  topLeftCorner: {
    top: 0,
    left: 0
  },
  topRightCorner: {
    top: 0,
    right: 0
  },
  bottomLeftCorner: {
    bottom: 0,
    left: 0
  },
  bottomRightCorner: {
    bottom: 0,
    right: 0
  },
  mask: {
    position: "absolute"
  },
  hintContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center"
  }
});
