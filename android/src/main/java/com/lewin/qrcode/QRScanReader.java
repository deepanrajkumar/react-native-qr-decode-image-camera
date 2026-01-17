package com.lewin.qrcode;

import android.net.Uri;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.mlkit.vision.barcode.Barcode;
import com.google.mlkit.vision.barcode.BarcodeScanner;
import com.google.mlkit.vision.barcode.BarcodeScannerOptions;
import com.google.mlkit.vision.barcode.BarcodeScanning;
import com.google.mlkit.vision.common.InputImage;

import java.io.IOException;
import java.util.List;

public class QRScanReader extends ReactContextBaseJavaModule {

    public QRScanReader(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "QRCodeImageDecoder";
    }

    @ReactMethod
    public void decodeImage(String fileUri, final Promise promise) {
        if (fileUri == null || fileUri.trim().isEmpty()) {
            promise.reject("INVALID_URI", "fileUri is empty");
            return;
        }
        Uri uri = Uri.parse(fileUri);
        final InputImage image;
        try {
            image = InputImage.fromFilePath(getReactApplicationContext(), uri);
        } catch (IOException e) {
            promise.reject("IMAGE_READ_FAILED", e.getMessage(), e);
            return;
        }

        BarcodeScannerOptions options = new BarcodeScannerOptions.Builder()
                .setBarcodeFormats(Barcode.FORMAT_QR_CODE)
                .build();
        final BarcodeScanner scanner = BarcodeScanning.getClient(options);
        scanner.process(image)
                .addOnSuccessListener(barcodes -> {
                    try {
                        if (barcodes == null || barcodes.isEmpty()) {
                            promise.reject("NO_CODE", "No QR code found");
                            return;
                        }
                        String value = barcodes.get(0).getRawValue();
                        if (value == null || value.isEmpty()) {
                            promise.reject("NO_CODE", "No QR code data found");
                            return;
                        }
                        promise.resolve(value);
                    } finally {
                        scanner.close();
                    }
                })
                .addOnFailureListener(e -> {
                    try {
                        promise.reject("DECODE_FAILED", e.getMessage(), e);
                    } finally {
                        scanner.close();
                    }
                });
    }

    @ReactMethod
    public void readerQR(String fileUri, final Promise promise) {
        decodeImage(fileUri, promise);
    }
}
