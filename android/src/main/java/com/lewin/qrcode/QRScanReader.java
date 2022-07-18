package com.lewin.qrcode;

import android.net.Uri;
import android.util.Log;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.google.android.gms.tasks.OnFailureListener;
import com.google.android.gms.tasks.OnSuccessListener;
import com.google.android.gms.tasks.Task;
import com.google.mlkit.vision.barcode.Barcode;
import com.google.mlkit.vision.barcode.BarcodeScanner;
import com.google.mlkit.vision.barcode.BarcodeScannerOptions;
import com.google.mlkit.vision.barcode.BarcodeScanning;
import com.google.mlkit.vision.common.InputImage;

import java.io.IOException;
import java.util.LinkedList;
import java.util.List;

/**
 * Created by lewin on 2018/3/14,
 * Updated by stefanmajiros on 2021/6/15
 */

public class QRScanReader extends ReactContextBaseJavaModule  {

    public QRScanReader(ReactApplicationContext reactContext) {
        super(reactContext);
    }

    @Override
    public String getName() {
        return "QRScanReader";
    }

    @ReactMethod
    public void readerQR(String fileUrl, final Promise promise ) {
        // ML Vision : https://developers.google.com/ml-kit/vision/barcode-scanning/android#java
        try {
            Uri uri = Uri.parse(fileUrl);
            InputImage image = InputImage.fromFilePath(this.getReactApplicationContext(), uri);
            BarcodeScannerOptions options = new BarcodeScannerOptions.Builder()
                    .setBarcodeFormats(
                            Barcode.FORMAT_AZTEC,
                            Barcode.FORMAT_QR_CODE
                    )
                    .build();
            final BarcodeScanner scanner = BarcodeScanning.getClient(options);
            Task<List<Barcode>> result = scanner.process(image)
                    .addOnSuccessListener(new OnSuccessListener<List<Barcode>>() {
                        @Override
                        public void onSuccess(List<Barcode> barcodes) {
                            Log.d("OK", " " +  barcodes.toString());
                            List<String> rawValues = new LinkedList<>();
                            for (Barcode barcode: barcodes) {
                                String rawValue = barcode.getRawValue();
                                rawValues.add(rawValue);
                            }
                            scanner.close();
                            if (!rawValues.isEmpty()){
                                promise.resolve(rawValues.get(0));
                            } else {
                                promise.reject("NOT_OK", "Invalid or No related QR code");
                            }

                        }
                    })
                    .addOnFailureListener(new OnFailureListener() {
                        @Override
                        public void onFailure(@NonNull Exception e) {
                            Log.d("NOT_OK", "" +  e.getMessage());
                            scanner.close();
                            promise.reject("NOT_OK", e.getMessage());

                        }
                    });
        } catch (IOException e) {
            Log.e("ERROR", "" + e.getMessage());
            e.printStackTrace();
        }
    }
}
