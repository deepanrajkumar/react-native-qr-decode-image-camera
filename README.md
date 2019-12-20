# react-native-qr-decode-image-camera

```bash
yarn add react-native-qr-decode-image-camera
or
npm install react-native-qr-decode-image-camera
run
npm install
```

## Install react native camera and give necessary permission

```bash
then run

cd ios
pod install
```

```bash
then
react-native run-android
or
react-native run-ios

```

# Example

```javascript
import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import { QRscanner } from "react-native-qr-decode-image-camera";

export default class Scanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      flashMode: false,
      zoom: 0.2
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <QRscanner
          onRead={this.onRead}
          renderBottomView={this.bottomView}
          flashMode={this.state.flashMode}
          zoom={this.state.zoom}
          finderY={50}
        />
      </View>
    );
  }
  bottomView = () => {
    return (
      <View
        style={{ flex: 1, flexDirection: "row", backgroundColor: "#0000004D" }}
      >
        <TouchableOpacity
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          onPress={() => this.setState({ flashMode: !this.state.flashMode })}
        >
          <Text style={{ color: "#fff" }}>йоба-боба-функция</Text>
        </TouchableOpacity>
      </View>
    );
  };
  onRead = res => {
    console.log(res);
  };
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000"
  }
});
```

### QRreader

```javascript
import React, { Component } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity
} from "react-native";
import { QRreader } from "react-native-qr-decode-image-camera";
import ImagePicker from "react-native-image-picker";

export default class Scanner extends Component {
  constructor(props) {
    super(props);
    this.state = {
      reader: {
        message: null,
        data: null
      }
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => {
            this.openPhoto();
          }}
        >
          <Text style={{ marginTop: 20 }}>просто кек бля</Text>
        </TouchableOpacity>
        <View>
          {!this.state.reader ? (
            <Text>
              {!this.state.reader.message ? "" : `${this.state.reader.message}`}
            </Text>
          ) : (
            <Text>
              {!this.state.reader.message
                ? ""
                : `${this.state.reader.message}:${this.state.reader.data}`}
            </Text>
          )}
        </View>
      </View>
    );
  }

  openPhoto() {
    console.log("ImagePicker");
    ImagePicker.launchImageLibrary({}, response => {
      console.log("Response = ", response);

      if (response.didCancel) {
        console.log("User cancelled image picker");
      } else if (response.error) {
        console.log("ImagePicker Error: ", response.error);
      } else if (response.customButton) {
        console.log("User tapped custom button: ", response.customButton);
      } else {
        if (response.uri) {
          var path = response.path;
          if (!path) {
            path = response.uri;
          }
          QRreader(path)
            .then(data => {
              this.setState({
                reader: {
                  message: "message",
                  data: data
                }
              });
              setTimeout(() => {
                this.setState({
                  reader: {
                    message: null,
                    data: null
                  }
                });
              }, 10000);
            })
            .catch(err => {
              this.setState({
                reader: {
                  message: "message",
                  data: null
                }
              });
            });
        }
      }
    });
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});
```

### QRscanner

| method             | type    | example                                                           | Remarks                                                                                   |
| ------------------ | ------- | ----------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| isRepeatScan       | boolean | false                                                             | whether to allow repeated scanning                                                        |
| zoom               | number  | 0                                                                 | Camera focal length range 0-1                                                             |
| flashMode          | bool    | false                                                             | Turn on the flashlight                                                                    |
| onRead             | func    | (res) => {}                                                       | scan callback                                                                             |
| maskColor          | string  | '# 0000004D'                                                      | mask layer color                                                                          |
| borderColor        | string  | '# 000000'                                                        | border color                                                                              |
| cornerColor        | string  | '# 22ff00'                                                        | Color of corner of scan frame                                                             |
| borderWidth        | number  | 0                                                                 | border width of scan frame                                                                |
| cornerBorderWidth  | number  | 4                                                                 | border width of scan frame corner                                                         |
| cornerBorderLength | number  | 20                                                                | width and height of the corner of the scan frame                                          |
| rectHeight         | number  | 200                                                               | Scan frame height                                                                         |
| rectWidth          | number  | 200                                                               | Scan Frame Width                                                                          |
| finderX            | number  | 0                                                                 | scan frame X axis offset                                                                  |
| finderY            | number  | 0                                                                 | scan frame Y axis offset                                                                  |
| isCornerOffset     | bool    | true                                                              | whether the corners are offset                                                            |
| cornerOffsetSize   | number  | 1                                                                 | offset                                                                                    |
| bottomHeight       | number  | 100                                                               | Reserved height at the bottom                                                             |
| scanBarAnimateTime | number  | 2500                                                              | scan line time                                                                            |
| scanBarColor       | string  | '# 22ff00'                                                        | scan line color                                                                           |
| scanBarImage       | any     | null                                                              | scan line image                                                                           |
| scanBarHeight      | number  | 1.5                                                               | scan line height                                                                          |
| scanBarMargin      | number  | 6                                                                 | scanline left and right margin                                                            |
| hintText           | string  | 'Put QR code / bar code into the box and scan it automatically'   |                                                                                           |
| hintTextStyle      | object  | {color: '# fff', fontSize: 14, backgroundColor: 'transparent'}    | hint string style                                                                         |
| hintTextPosition   | number  | 130                                                               | I dick knows that in this column the shot is written in Chinese understand it yourself))) |  |
| renderTopView      | func    | () => {}                                                          | render top View                                                                           |
| renderBottomView   | func    | () => <View style = {{flex: 1, backgroundColor: '# 0000004D'}} /> | render bottom View                                                                        |
| isShowScanBar      | bool    | true                                                              | whether to show scan lines                                                                |
| topViewStyle       | object  | null                                                              | render top container style                                                                |
| bottomViewStyle    | object  | null                                                              | render bottom container style                                                             |
