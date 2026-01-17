require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name         = "QrCode"
  s.version      = package["version"]
  s.summary      = "QR code scanner and image decoder for React Native"
  s.description  = "Modern QR code scanner overlay and image decoder for React Native apps."
  s.license      = { :type => "MIT", :file => "LICENSE" }
  s.homepage     = package["homepage"]
  s.source       = { :git => package["repository"]["url"], :tag => "#{s.version}" }
  s.author       = package["author"]
  s.platform     = :ios, "12.0"
  s.source_files = "ios/QrCode/*.{h,m,mm}"
  s.frameworks   = ["CoreImage"]
  s.dependency "React-Core"
end
