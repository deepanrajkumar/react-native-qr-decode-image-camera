import React, {Component} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Animated,
  Easing,
  Text,
  Image,
  Vibration,
  Platform,
  PixelRatio,
  StatusBar
} from 'react-native';
/**
 * Scanning Interface Mask
 * Write a separate class for easy copying
 */
export default class QRScannerView extends Component {
  static defaultProps = {
    maskColor: '#0000004D',
    cornerColor: '#22ff00',
    borderColor: '#000000',
    rectHeight: 200,
    rectWidth: 200,
    borderWidth: 0,
    cornerBorderWidth: 4,
    cornerBorderLength: 20,
    cornerOffsetSize: 1,
    isCornerOffset: true,
    bottomHeight: 100,
    scanBarAnimateTime: 2500,
    scanBarColor: '#22ff00',
    scanBarImage: null,
    scanBarHeight: 1.5,
    scanBarMargin: 6,
    hintText: 'Put the QR code / bar code into the box and it will scan automatically',
    hintTextStyle: {
      color: '#fff',
      fontSize: 14,
      backgroundColor: 'transparent'
    },
    hintTextPosition: 130,
    isShowScanBar: true
  };

  constructor(props) {
    super(props);
    this.state = {
      topWidth: 0,
      topHeight: 0,
      leftWidth: 0,
      animatedValue: new Animated.Value(0)
    }
    this.isClosed = false;
  }

  //Get background color
  getBackgroundColor = () => {
    return ({backgroundColor: this.props.maskColor});
  }

  //Get scan box background size
  getRectSize = () => {
    return ({height: this.props.rectHeight, width: this.props.rectWidth});
  }

  //Get scan frame border size

  getBorderSize = () => {
    if (this.props.isCornerOffset) {
      return ({
        height: this.props.rectHeight - this.props.cornerOffsetSize * 2,
        width: this.props.rectWidth - this.props.cornerOffsetSize * 2
      });
    } else {
      return ({height: this.props.rectHeight, width: this.props.rectWidth});
    }
  }

  //Get the color of the corner of the scan frame
  getCornerColor = () => {
    return ({borderColor: this.props.cornerColor});
  }

  //Get the size of the corner of the scan frame
  getCornerSize = () => {
    return ({height: this.props.cornerBorderLength, width: this.props.cornerBorderLength});
  }

  //Get scan frame size
  getBorderWidth = () => {
    return ({borderWidth: this.props.borderWidth});
  }

  //Get scan box color
  getBorderColor = () => {
    return ({borderColor: this.props.borderColor});
  }

  //Measure the size of the entire scanning component
  measureTotalSize = (e) => {
    let totalSize = e.layout;
    this.setState({topWidth: totalSize.width})
  }

  //Measure the position of the scan frame
  measureRectPosition = (e) => {
    let rectSize = e.layout;
    rectSize.x += this.props.finderX
    rectSize.y += this.props.finderY
    this.props.returnSize(rectSize)
    this.setState({topHeight: rectSize.y, leftWidth: rectSize.x})
  }

  //Get top mask height
  getTopMaskHeight = () => {
    if (this.props.isCornerOffset) {
      return this.state.topHeight + this.props.rectHeight - this.props.cornerOffsetSize;
    } else {
      return this.state.topHeight + this.props.rectHeight;
    }
  }

  //Get bottom mask height
  getBottomMaskHeight = () => {
    if (this.props.isCornerOffset) {
      return this.props.rectHeight + this.state.topHeight - this.props.cornerOffsetSize;
    } else {
      return this.state.topHeight + this.props.rectHeight;
    }
  }

  //Get the left and right mask height
  getSideMaskHeight = () => {
    if (this.props.isCornerOffset) {
      return this.props.rectHeight - this.props.cornerOffsetSize * 2;
    } else {
      return this.props.rectHeight;
    }
  }

  //Get left and right mask width
  getSideMaskWidth = () => {
    if (this.props.isCornerOffset) {
      return this.state.leftWidth + this.props.cornerOffsetSize;
    } else {
      return this.state.leftWidth;
    }
  }

  getBottomHeight = () => {
    return ({bottom: this.props.bottomHeight});
  }

  getScanBarMargin = () => {
    return ({marginRight: this.props.scanBarMargin, marginLeft: this.props.scanBarMargin})
  }

  getScanImageWidth = () => {
    return this.props.rectWidth - this.props.scanBarMargin * 2
  }

  //Draw scan lines
  _renderScanBar = () => {
    if (!this.props.isShowScanBar) 
      return;
    if (this.props.scanBarImage) {
      return <Image
        style={{
        resizeMode: 'contain',
        width: this.getScanImageWidth()
      }}
        source={this.props.scanBarImage}/>
    } else {
      return <View
        style={[
        this.getScanBarMargin(), {
          backgroundColor: this.props.scanBarColor,
          height: this.props.scanBarHeight
        }
      ]}/>
    }
  }

  render() {
    const animatedStyle = {
      transform: [
        {
          translateY: this.state.animatedValue
        }
      ]
    };
    return (
      <View
        onLayout={({nativeEvent: e}) => this.measureTotalSize(e)}
        style={[
        styles.container, this.getBottomHeight()
      ]}>
        {/* <View style={{flex:1}}></View> */}
        <View
          style={[
          styles.viewfinder, this.getRectSize(),{top:this.props.finderY,left:this.props.finderX}
          ]}
          onLayout={({nativeEvent: e}) => this.measureRectPosition(e)}>
          <View
            style={[
            this.getBorderSize(),
            this.getBorderColor(),
            this.getBorderWidth()
          ]}>

            <Animated.View style={[animatedStyle]}>
              {this._renderScanBar()}
            </Animated.View>

          </View>
          <View
            style={[
            this.getCornerColor(),
            this.getCornerSize(),
            styles.topLeftCorner, {
              borderLeftWidth: this.props.cornerBorderWidth,
              borderTopWidth: this.props.cornerBorderWidth
            }
          ]}/>
          <View
            style={[
            this.getCornerColor(),
            this.getCornerSize(),
            styles.topRightCorner, {
              borderRightWidth: this.props.cornerBorderWidth,
              borderTopWidth: this.props.cornerBorderWidth
            }
          ]}/>
          <View
            style={[
            this.getCornerColor(),
            this.getCornerSize(),
            styles.bottomLeftCorner, {
              borderLeftWidth: this.props.cornerBorderWidth,
              borderBottomWidth: this.props.cornerBorderWidth
            }
          ]}/>
          <View
            style={[
            this.getCornerColor(),
            this.getCornerSize(),
            styles.bottomRightCorner, {
              borderRightWidth: this.props.cornerBorderWidth,
              borderBottomWidth: this.props.cornerBorderWidth
            }
          ]}/>
        </View>

        <View
          style={[
          this.getBackgroundColor(),
          styles.topMask, {
            bottom: this.getTopMaskHeight() - this.props.finderY * 3,
            top: 0,
            width: this.state.topWidth
          }
        ]}/>

        <View
          style={[
          this.getBackgroundColor(),
          styles.leftMask, {
            height: this.getSideMaskHeight(),
            width: this.getSideMaskWidth() - this.props.finderX ,
            bottom: this.getTopMaskHeight() - this.props.finderY * 3 - this.getSideMaskHeight()
          }
        ]}/>

        <View
          style={[
          this.getBackgroundColor(),
          styles.rightMask, {
            height: this.getSideMaskHeight(),
            width: this.getSideMaskWidth() - this.props.finderX * 3,
            bottom: this.getTopMaskHeight() - this.props.finderY * 3 - this.getSideMaskHeight()
          }
        ]}/>

        <View
          style={[
          this.getBackgroundColor(),
          styles.bottomMask, {
            top: this.getBottomMaskHeight() - this.props.finderY,
            width: this.state.topWidth
          }
        ]}/>

        <View
          style={{
          position: 'absolute',
          bottom: this.props.hintTextPosition
        }}>
          <Text style={[this.props.hintTextStyle,{top:this.props.finderY,left:this.props.finderX}]}>{this.props.hintText}</Text>
        </View>

      </View>
    );
  }

  componentDidMount() {
    this.scannerLineMove();
  }

  componentWillUnmount() {
    this.isClosed = true;
  }

  scannerLineMove() {
    if (this.isClosed) {
      return;
    }
    this.state.animatedValue.setValue(0); //重置Rotate动画值为0
    Animated.timing(
      this.state.animatedValue,
      {toValue: this.props.rectHeight,
      duration: this.props.scanBarAnimateTime,
      easing: Easing.linear,
      useNativeDriver: true
    }).start(() => this.scannerLineMove());
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'absolute',
    top: 0,
    right: 0,
    left: 0
  },
  viewfinder: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  topLeftCorner: {
    position: 'absolute',
    top: 0,
    left: 0
  },
  topRightCorner: {
    position: 'absolute',
    top: 0,
    right: 0
  },
  bottomLeftCorner: {
    position: 'absolute',
    bottom: 0,
    left: 0
  },
  bottomRightCorner: {
    position: 'absolute',
    bottom: 0,
    right: 0
  },
  topMask: {
    position: 'absolute',
    top: 0
  },
  leftMask: {
    position: 'absolute',
    left: 0
  },
  rightMask: {
    position: 'absolute',
    right: 0
  },
  bottomMask: {
    position: 'absolute',
    bottom: 0
  }
});
