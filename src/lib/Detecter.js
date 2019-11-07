import React, {PureComponent} from 'react';
import {AppRegistry, StyleSheet, Text, TouchableOpacity, View, TouchableHighlight} from 'react-native';
import * as Permissions from 'expo-permissions';
import {Camera} from 'expo-camera';
import * as tf from '@tensorflow/tfjs'

import * as posenet from '@tensorflow-models/posenet';


import * as _ from 'lodash';

import styles from '../css/styles';


function base64ToBuffer(base64) {

    return new Uint8Array(decodeAsArray(base64, 8))

}

function decode(input) {
    var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
    var output = [],
        chr1, chr2, chr3,
        enc1, enc2, enc3, enc4,
        i = 0;

    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");

    while (i < input.length) {
        enc1 = _keyStr.indexOf(input.charAt(i++));
        enc2 = _keyStr.indexOf(input.charAt(i++));
        enc3 = _keyStr.indexOf(input.charAt(i++));
        enc4 = _keyStr.indexOf(input.charAt(i++));
        chr1 = (enc1 << 2) | (enc2 >> 4);
        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
        chr3 = ((enc3 & 3) << 6) | enc4;

        output.push(String.fromCharCode(chr1));

        if (enc3 != 64) {
            output.push(String.fromCharCode(chr2));
        }
        if (enc4 != 64) {
            output.push(String.fromCharCode(chr3));
        }
    }

    output = output.join('');

    return output;
};

function decodeAsArray(input, bytes) {
    var dec = decode(input),
        ar = [], i, j, len;
    for (i = 0, len = dec.length / bytes; i < len; i++) {
        ar[i] = 0;
        for (j = bytes - 1; j >= 0; --j) {
            ar[i] += dec.charCodeAt((i * bytes) + j) << (j * 8);
        }
    }

    return ar;
};




let net = null
let takeData = null
let poseData = null
let rawData = null



function isAndroid() {
    return /Android/i.test(navigator.userAgent);
}

function isiOS() {
    return /iPhone|iPad|iPod/i.test(navigator.userAgent);
}

export function isMobile() {
    return isAndroid() || isiOS();
}


const PendingView = () => (
    <View
        style={{
            flex: 1,
            backgroundColor: 'lightgreen',
            justifyContent: 'center',
            alignItems: 'center',
        }}
    >
        <Text>Waiting</Text>
    </View>
);

async function loadImage(imageData) {
    const image = new Image();
    const promise = new Promise((resolve, reject) => {
        image.crossOrigin = '';
        image.onload = () => {
            resolve(image);
        };
    });
    image.src = imageData.uri
    return promise;
}

var totalPushUp = 0;
var currentPosition = 1;


// Excises Detect

const find_angle = function (shoulderPoint, elbowPoint, wristPoint) {
    var AB = Math.sqrt(Math.pow(elbowPoint.x-shoulderPoint.x,2)+ Math.pow(elbowPoint.y-shoulderPoint.y,2));
    var BC = Math.sqrt(Math.pow(elbowPoint.x-wristPoint.x,2)+ Math.pow(elbowPoint.y-wristPoint.y,2));
    var AC = Math.sqrt(Math.pow(wristPoint.x-shoulderPoint.x,2)+ Math.pow(wristPoint.y-shoulderPoint.y,2));
    return Math.acos((BC*BC+AB*AB-AC*AC)/(2*BC*AB));
}

const checkStartPosition = function (leftAngleDegree, rightAngleDegree){
    if(leftAngleDegree > 135 && rightAngleDegree > 135){
        return true
    }
    return false
}

const checkEndPosition = function (leftAngleDegree, rightAngleDegree){
    if(leftAngleDegree < 120 && rightAngleDegree < 120){
        return true
    }
    return false
}



const PullUpDetection = function (keypoints) {
    const pullUpPosition = Object.freeze({"start":1, "end":2, "complete":3})

    // Get two hands keypoint
    var leftShoulder = _.filter(keypoints, item => item.part === 'leftShoulder');
    var leftElbow = _.filter(keypoints, item => item.part === 'leftElbow');
    var leftWrist = _.filter(keypoints, item => item.part === 'leftWrist');

    var rightShoulder = _.filter(keypoints, item => item.part === 'rightShoulder');
    var rightElbow = _.filter(keypoints, item => item.part === 'rightElbow');
    var rightWrist = _.filter(keypoints, item => item.part === 'rightWrist');

    // detect fully two arms with confidence score
    var leftArmConfidence = leftShoulder[0].score + leftElbow[0].score + leftWrist[0].score;
    var rightArmConfidence = rightShoulder[0].score + rightElbow[0].score + rightWrist[0].score;

    // calculate angle of 3 points
    var leftAngle = find_angle(leftShoulder[0].position, leftElbow[0].position, leftWrist[0].position);
    var rightAngle = find_angle(rightShoulder[0].position, rightElbow[0].position, rightWrist[0].position);

    var leftAngleDegree = (leftAngle * 180) / Math.PI;
    var rightAngleDegree = (rightAngle * 180) / Math.PI;


    if (leftArmConfidence >= 2.5 && rightArmConfidence >= 2.5) {
        // Check wrist, elbow and lefteye position
        var validPosition = (leftElbow[0].position.y - leftShoulder[0].position.y) > 10 ;
        console.log(validPosition);
        if (checkStartPosition(leftAngleDegree, rightAngleDegree) && validPosition){
            if (currentPosition === pullUpPosition.end){
                currentPosition = pullUpPosition.complete;
                totalPushUp += 1


            }
            else {currentPosition = pullUpPosition.start}
            // if (this.state.currentPosition === pullUpPosition.end){
            // this.setState({ currentPosition : pullUpPosition.complete, total: this.state.total + 1 });
            // }
            // else{
            // this.setState({ currentPosition : pullUpPosition.start });
            // }
            // console.log(this.state.currentPosition, '========',  this.state.total );
            console.log(currentPosition, '======== Total: ',  totalPushUp );
        }
        else if (checkEndPosition(leftAngleDegree, rightAngleDegree)){
            // this.setState({ currentPosition : pullUpPosition.end });
            console.log(currentPosition, '======== Total: ',  totalPushUp);

            currentPosition = pullUpPosition.end;
        }
    }else{
        // console.log('Haven\'t completely detect two hands');
    }

    return totalPushUp

}


class Detecter extends PureComponent {

    state = {
        hasCameraPermission: null,
        type: Camera.Constants.Type.front,
        countStatus: 'start',
        count: 0
    };

    async componentDidMount() {
        try {
            const {status} = await Permissions.askAsync(Permissions.CAMERA);
            console.warn('Permissions all')
            await tf.ready()
            net = await posenet.load({
                architecture: 'MobileNetV1',
                outputStride: 16,
                inputResolution: {width: 640, height: 480},
                multiplier: 0.75
            });
            this.setState({hasCameraPermission: status === 'granted'});
            console.warn('ready all')

        } catch (error) {
            console.error(error)
        }

    }

    render() {
        //const { navigate } = this.props.navigation;
        const {hasCameraPermission} = this.state;
        if (hasCameraPermission === null) {
            return <View/>;
        } else if (hasCameraPermission === false) {
            return <Text>No access to camera</Text>;
        } else {
            return (
                <View style={{flex: 1}}>
                    <View style={styles.headerDetecter}>
                        <Camera style={{flex: 1}} type={this.state.type} pictureSize={'640x480'} ref={ref => {
                            this.camera = ref;
                        }}>
                        </Camera>
                    </View>
                    <View style={styles.colRow}>
                        <Text style={[styles.colLeft, styles.lessonTitleBig]}>
                            Push up
                        </Text>
                        <TouchableHighlight style={styles.colRight} onPress={() => this.startCounting()}>
                            <Text style={styles.labelTexteBack}>Start</Text>
                        </TouchableHighlight>
                    </View>
                    <View style={styles.sectionNumber}>
                        <Text style={styles.number}>
                            {this.state.count}
                        </Text>
                        <Text style={styles.labelReps}>
                            reps
                        </Text>
                      </View>
                      <TouchableHighlight style={styles.fullWidthButton} onPress={() => this.endCounting()}>
                          <Text style={styles.fullWidthButtonText}>Finish</Text>
                      </TouchableHighlight>
                </View>
            );
        }
    }

    takePicture = async function () {
        if (this.camera) {
            try {
                const options = {base64: true, quality: 0.2};

                takeData = await this.camera.takePictureAsync(options);
                //
                // rawData = {width: takeData.width, height: takeData.height, data: base64ToBuffer(takeData.base64)}
                // console.log('base64ToBuffered')

                rawData = await loadImage(takeData)
                poseData = await net.estimateSinglePose(rawData, {
                    flipHorizontal: false
                });;
                console.log('pose')

                var countTotal = PullUpDetection(poseData.keypoints);

                this.setState({count: countTotal});

            } catch (e) {
                console.error(e)
            }

            setTimeout(this.loopPicture(),100)
        }

    };

    loopPicture = function () {
        if(this.state.countStatus == 'start') this.takePicture().then(()=>{
            takeData = null
            rawData = null
            poseData = null
        })
    }

    startCounting = function () {
        console.log('startCounting:', this.state.countStatus)
        this.loopPicture()
    }
    endCounting = function () {
        this.setState({countStatus: 'end'});
        console.log('endCounting:', this.state.countStatus)
        // this.props.navigation.navigate('End', { });

    }


}


// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         flexDirection: 'column',
//         backgroundColor: 'black',
//     },
//     preview: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         alignItems: 'center',
//     },
//     capture: {
//         flex: 0,
//         backgroundColor: '#fff',
//         borderRadius: 5,
//         padding: 15,
//         paddingHorizontal: 20,
//         alignSelf: 'center',
//         margin: 20,
//     },
// });


export default Detecter

console.warn('58')
