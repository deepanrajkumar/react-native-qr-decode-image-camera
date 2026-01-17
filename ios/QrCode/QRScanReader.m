#import "QRScanReader.h"
#import <CoreImage/CoreImage.h>

@implementation QRScanReader

RCT_EXPORT_MODULE(QRCodeImageDecoder);

RCT_EXPORT_METHOD(decodeImage:(NSString *)fileUri
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  if (fileUri == nil || [fileUri length] == 0) {
    reject(@"INVALID_URI", @"fileUri is empty", nil);
    return;
  }

  dispatch_async(dispatch_get_global_queue(QOS_CLASS_USER_INITIATED, 0), ^{
    NSString *path = [fileUri stringByReplacingOccurrencesOfString:@"file://" withString:@""];
    NSData *fileData = [NSData dataWithContentsOfFile:path];
    if (!fileData) {
      reject(@"IMAGE_READ_FAILED", @"Unable to read image data", nil);
      return;
    }

    CIImage *ciImage = [CIImage imageWithData:fileData];
    if (!ciImage) {
      reject(@"IMAGE_READ_FAILED", @"Unable to decode image", nil);
      return;
    }

    CIDetector *detector = [CIDetector detectorOfType:CIDetectorTypeQRCode
                                              context:nil
                                              options:@{ CIDetectorAccuracy: CIDetectorAccuracyHigh }];
    NSArray *features = [detector featuresInImage:ciImage];
    if (!features || [features count] == 0) {
      reject(@"NO_CODE", @"No QR code found", nil);
      return;
    }

    CIQRCodeFeature *feature = [features firstObject];
    NSString *result = feature.messageString;
    if (result == nil || [result length] == 0) {
      reject(@"NO_CODE", @"No QR code data found", nil);
      return;
    }

    resolve(result);
  });
}

RCT_EXPORT_METHOD(readerQR:(NSString *)fileUri
                  resolver:(RCTPromiseResolveBlock)resolve
                  rejecter:(RCTPromiseRejectBlock)reject)
{
  [self decodeImage:fileUri resolver:resolve rejecter:reject];
}

@end
