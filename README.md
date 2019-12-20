# react-native-qr-decode-image-camera

[! [NPM Version] (<https://img.shields.io/npm/v/react-native-qr-decode-image-camera.svg?style=flat)]> (<https://www.npmjs.com> / package / react-native-qr-decode-image-camera)
[! [License] (<http://img.shields.io/npm/l/react-native-qr-decode-image-camera.svg?style=flat)]> (<https://github.com/shifeng1993/> (react-native-qr-decode-image-camera / blob / master / LICENSE)

A react-native QR code scanning component that supports the limitation of the scanning area and the offset of the scanning area.

## installation steps

### Installation dependencies

`` `bash yarn add react-native-camera react-native-qr-decode-image-camera `` ``

### link dependency to native

`` `bash react-native link react-native-camera && react-native-qr-decode-image-camera `` ``

### Add camera permissions

-ios in `ios / projectName / Info.plist`:

```xml
<key> NSCameraUsageDescription </ key>
<string />
<key> NSPhotoLibraryUsageDescription </ key>
<string />
<key> NSMicrophoneUsageDescription </ key>
<string />
<key> NSPhotoLibraryAddUsageDescription </ key>
<string />
```

-android in `android / app / src / main / AndroidManifest.xml`:

```xml
<uses-permission android: name = "android.permission.CAMERA" />
<uses-permission android: name = "android.permission.RECORD_AUDIO" />
<uses-permission android: name = "android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission android: name = "android.permission.WRITE_EXTERNAL_STORAGE" />
<uses-permission android: name = "android.permission.VIBRATE" />
```

#### Fix the error that camera component cannot find google () method

<https://github.com/react-native-community/react-native-camera/blob/master/docs/GradleUpgradeGuide.md>

## Using components

### Scan

`` `javascript
import React, {Component} from "react";
import {
Platform
StyleSheet,
Text
View
Touchableoppacity
} from "react-native";
import {QRscanner} from "react-native-qr-decode-image-camera";

export default class Scanner extends Component {
Constructor (props) {
Super (props);
This.state = {
FlashMode: false,
Zoom: 0.2
...;
}
Render () {
Return (
<View style = {styles.container}>
QR <QRscanner
OnRead = {this.onRead}
BrenderBottomView = {this.bottomView}
FlashMode = {this.state.flashMode}
Z zoom = {this.state.zoom}
FinderY = {50}
/>
... View </ View>
);
}
BottomView = () => {
Return (
View <View
Style style = {{flex: 1, flexDirection: "row", backgroundColor: "# 0000004D"}}

> ^ <TouchableOpacity
> Style style = {{flex: 1, alignItems: "center", justifyContent: "center"}}
> } OnPress = (() => this.setState ({flashMode :! this.state.flashMode))}
> ...>
> <Text style = {{color: "#fff"}}> Click me to turn on / off the flashlight </ Text>
> </ TouchableOpacity>
> ... View </ View>
> );
> }};
> OnRead = res => {
> Console.log (res);
> }};
> }
> const styles = StyleSheet.create ({
> Container: {
> Flex: 1,
> BackgroundColor: "# 000"
> }
> });

```

### Identification

`` `javascript
import React, {Component} from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import {QRreader} from "react-native-qr-decode-image-camera";
import ImagePicker from "react-native-image-picker";

export default class Scanner extends Component {
  constructor (props) {
    super (props);
    this.state = {
      reader: {
        message: null,
        data: null
      }
    };
  }
  render () {
    return (
      <View style = {styles.container}>
        <TouchableOpacity
          onPress = {() => {
            this.openPhoto ();
          }}
        >
          <Text style = {{marginTop: 20}}> Open album identification QR code </ Text>
        </ TouchableOpacity>
        <View>
          {! this.state.reader? (
            <Text>
              {! this.state.reader.message? "": `$ {this.state.reader.message}`}
            </ Text>
          ): (
            <Text>
              {! this.state.reader.message
                ? ""
                : `$ {this.state.reader.message}: $ {this.state.reader.data}`}
            </ Text>
          )}
        </ View>
      </ View>
    );
  }

  openPhoto () {
    console.log ("ImagePicker");
    ImagePicker.launchImageLibrary ({}, response => {
      console.log ("Response =", response);

      if (response.didCancel) {
        console.log ("User cancelled image picker");
      } else if (response.error) {
        console.log ("ImagePicker Error:", response.error);
      } else if (response.customButton) {
        console.log ("User tapped custom button:", response.customButton);
      } else {
        if (response.uri) {
          var path = response.path;
          if (! path) {
            path = response.uri;
          }
          QRreader (path)
            .then (data => {
              this.setState ({
                reader: {
                  message: "Successfully identified",
                  data: data
                }
              });
              // automatically clear after ten seconds
              setTimeout (() => {
                this.setState ({
                  reader: {
                    message: null,
                    data: null
                  }
                });
              }, 10000);
            })
            .catch (err => {
              this.setState ({
                reader: {
                  message: "Identification failed",
                  data: null
                }
              });
            });
        }
      }
    });
  }
}
const styles = StyleSheet.create ({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
`` `

## Run the example

`` `bash
cd example
yarn
$ react-native run-ios or $ react-native run-android
`` `

The code in the example has been linked, so do not use link

### QRscanner

| Property | Type | Default | Remarks |
| ------------------ | ------- | ---------------------- ---------------------------- --------- | ------------ -------------- |
| isRepeatScan | boolean | false | whether to allow repeated scanning |
| zoom | number | 0 | Camera focal length range 0-1 |
flashMode | bool | false | Turn on the flashlight |
| onRead | func | (res) => {} | scan callback |
maskColor | string | '# 0000004D' | mask layer color |
| borderColor | string | '# 000000' | border color |
cornerColor | string | '# 22ff00' | Color of corner of scan frame |
borderWidth | number | 0 | border width of scan frame |
cornerBorderWidth | number | 4 | border width of scan frame corner |
cornerBorderLength | number | 20 | width and height of the corner of the scan frame |
| rectHeight | number | 200 | Scan frame height |
| rectWidth | number | 200 | Scan Frame Width |
finderX | number | 0 | scan frame X axis offset |
finderY | number | 0 | scan frame Y offset |
| isCornerOffset | bool | true | whether the corners are offset |
cornerOffsetSize | number | 1 | offset |
bottomHeight | number | 100 | Reserved height at the bottom |
scanBarAnimateTime | number | 2500 | scan line time |
scanBarColor | string | '# 22ff00' | scan line color |
scanBarImage | any | null | scan line image |
scanBarHeight | number | 1.5 | scan line height |
scanBarMargin | number | 6 | scanline left and right margin |
| hintText | string | 'Put QR code / bar code into the box and scan it automatically' |
hintTextStyle | object | {color: '# fff', fontSize: 14, backgroundColor: 'transparent'} | hint string style |
| hintTextPosition | number | 130 | hint string value from bottom of container |
| renderTopView | func | () => {} | render top View |
renderBottomView | func | () => <View style = {{flex: 1, backgroundColor: '# 0000004D'}} /> | render bottom View |
| isShowScanBar | bool | true | whether to show scan lines |
topViewStyle | object | null | render top container style |
bottomViewStyle | object | null | render bottom container style |

### QRreader

QRreader (path: uri) is a promise object that accepts a uri image path parameter,
Returns a successfully identified object, or an error on failure

## Historical version features

#### 1.3.2 Because there are many problems with the calculation of the android scan area, comment out the android calculation scan area and resume the full screen scan of the android device

#### 1.3.1 Fix the error that the library cannot be found in the package of ios, and reduce the minimum version of ios support for album QR code

#### 1.3.0 Fix a bug in android scanning, add album QR code recognition, thanks to the open source QR code recognition of Lewin God

#### 1.2.4 Restrict code scanning type, fix android error

#### 1.2.2 Add whether to allow repeated scanning API

#### 1.2.1 Fix android error and android scan area bug

#### 1.2.0 Modify the underlying dependent camera components, add scan areas, and set the XY axis offset

#### 1.1.3 Improve documentation

#### 1.1.2 git keeps demo examples, npm package removes demo examples

#### 1.1.1 Modify the wrong place of the document, add demo example

#### 1.1.0 Fix bug, add flashlight api

#### 1.0.0 Upload basic components
```
