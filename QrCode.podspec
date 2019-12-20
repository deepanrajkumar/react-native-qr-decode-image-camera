Pod::Spec.new do |s|
  s.name        = "QrCode"
  s.version     = "1.0.0"
  s.summary     = "some interesting summary."
  s.description = "some interesting summary. 123123"
  s.license     = { :type => "MIT", :file => "LICENSE" }
  s.homepage    = "https://github.com/deepanrajkumar01/react-native-qr-decode-image-camera#readme"
  s.source      = { :git => "https://github.com/deepanrajkumar01/react-native-qr-decode-image-camera.git", :tag => "#{s.version}" }
  s.author      = "Igor"
  s.platform    = :ios, "9.0"
  s.source_files    = "ios/QrCode/", "ios/QrCode/*.{h,m}"
  s.frameworks       = ["UIKit", "AVFoundation", "CoreImage"]
  s.dependency 'React'
end
