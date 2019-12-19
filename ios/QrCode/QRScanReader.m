#import "QRScanReader.h"
#import <AVFoundation/AVFoundation.h>
#import <CoreImage/CoreImage.h>

@implementation QRScanReader
RCT_EXPORT_MODULE();

RCT_EXPORT_METHOD(readerQR:(NSString *)fileUrl success:(RCTPromiseResolveBlock)success failure:(RCTResponseErrorBlock)failure){
  dispatch_sync(dispatch_get_main_queue(), ^{
    NSString *result = [self readerQR:fileUrl];
    if(result){
      success(result);
    }else{
      NSString *domain = @"";
      NSString *desc = NSLocalizedString(@"No related QR code", @"");
      NSDictionary *userInfo = @{ NSLocalizedDescriptionKey : desc };
      NSError *error = [NSError errorWithDomain:domain
                                           code:404
                                       userInfo:userInfo];
      failure(error);
    }
  });
  
  
  
}

-(NSString*)readerQR:(NSString*)fileUrl{
  fileUrl = [fileUrl stringByReplacingOccurrencesOfString:@"file://" withString:@""];
  
  CIContext *context = [CIContext contextWithOptions:nil];
  
  // CIDetector(CIDetector(Can be used for face recognition) for image analysis，Declare a CIDetector，And set the recognition type CIDetectorTypeQRCode
  CIDetector *detector = [CIDetector detectorOfType:CIDetectorTypeQRCode context:context options:@{CIDetectorAccuracy:CIDetectorAccuracyHigh}];
  NSData *fileData = [[NSData alloc] initWithContentsOfFile:fileUrl];
  CIImage *ciImage = [CIImage imageWithData:fileData];
  NSArray *features = [detector featuresInImage:ciImage];
  if(!features || features.count==0){
    return nil;
  }
  //3. Get scan results
  CIQRCodeFeature *feature = [features objectAtIndex:0];
  NSString *scannedResult = feature.messageString;
  return scannedResult;
}

@end
